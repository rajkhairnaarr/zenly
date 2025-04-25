import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true');
  // Use ref to track API request status
  const pendingRequests = useRef({});
  const requestTimeouts = useRef({});

  // Set up axios defaults
  useEffect(() => {
    // Use relative URL which will go through the Vite proxy in development
    axios.defaults.baseURL = '/api';
    
    // Add request interceptor to prevent duplicate requests causing freezing
    axios.interceptors.request.use(
      config => {
        const requestKey = `${config.method}-${config.url}`;
        
        // Cancel any existing timeouts for this request
        if (requestTimeouts.current[requestKey]) {
          clearTimeout(requestTimeouts.current[requestKey]);
        }
        
        // If there's already a pending request with this key, don't send another
        if (pendingRequests.current[requestKey]) {
          console.log(`Request ${requestKey} already in progress, cancelling duplicate`);
          
          // Create a cancel token
          const source = axios.CancelToken.source();
          config.cancelToken = source.token;
          source.cancel('Duplicate request cancelled');
          
          return config;
        }
        
        // Mark this request as pending
        pendingRequests.current[requestKey] = true;
        
        // Set a timeout to clear the pending flag after 10 seconds
        // This prevents the app from getting stuck if a request never completes
        requestTimeouts.current[requestKey] = setTimeout(() => {
          console.log(`Request ${requestKey} timed out, clearing pending status`);
          delete pendingRequests.current[requestKey];
          delete requestTimeouts.current[requestKey];
        }, 10000);
        
        return config;
      },
      error => Promise.reject(error)
    );
    
    // Add response interceptor to clear pending request flags
    axios.interceptors.response.use(
      response => {
        const requestKey = `${response.config.method}-${response.config.url}`;
        
        // Clear the pending flag for this request
        delete pendingRequests.current[requestKey];
        
        // Clear any timeouts
        if (requestTimeouts.current[requestKey]) {
          clearTimeout(requestTimeouts.current[requestKey]);
          delete requestTimeouts.current[requestKey];
        }
        
        return response;
      },
      error => {
        // If we have config, clear the pending flag
        if (error.config) {
          const requestKey = `${error.config.method}-${error.config.url}`;
          
          delete pendingRequests.current[requestKey];
          
          if (requestTimeouts.current[requestKey]) {
            clearTimeout(requestTimeouts.current[requestKey]);
            delete requestTimeouts.current[requestKey];
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    return () => {
      // Clear all pending timeouts when component unmounts
      Object.values(requestTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const guestMode = localStorage.getItem('isGuest') === 'true';
    
    if (guestMode) {
      setIsGuest(true);
      setUser({
        name: 'Guest User',
        email: 'guest@example.com',
        role: 'user',
        id: 'guest-user'
      });
      setLoading(false);
    } else if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []); // Only run on mount

  // Load user data with retry logic
  const loadUser = async (retryCount = 0) => {
    try {
      const res = await axios.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error loading user:', err);
      // Don't remove token or show error if backend is not available
      if (err.code === 'ERR_NETWORK') {
        console.log('Backend server not available, continuing in offline mode');
        
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          
          setTimeout(() => {
            loadUser(retryCount + 1);
          }, delay);
          
          // Don't set loading to false yet
          return;
        }
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setError(err.response?.data?.message || 'Error loading user');
      }
    } finally {
      setLoading(false);
    }
  };

  // Guest login
  const guestLogin = () => {
    // Clear any existing auth tokens
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    
    // Set guest mode
    localStorage.setItem('isGuest', 'true');
    setIsGuest(true);
    
    // Set guest user
    setUser({
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'user',
      id: 'guest-user'
    });
    
    return { success: true };
  };

  // Register user
  const register = async (formData) => {
    try {
      // Clear guest mode if active
      if (isGuest) {
        localStorage.removeItem('isGuest');
        setIsGuest(false);
      }
      
      const res = await axios.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      await loadUser();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      // Clear guest mode if active
      if (isGuest) {
        localStorage.removeItem('isGuest');
        setIsGuest(false);
      }
      
      const res = await axios.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      await loadUser();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsGuest(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
        guestLogin,
        isGuest
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 