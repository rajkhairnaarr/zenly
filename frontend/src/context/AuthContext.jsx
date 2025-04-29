import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Set the base URL based on the environment
const API_URL = import.meta.env.PROD 
  ? ''  // Empty because we're using relative URLs now that will be caught by the rewrites
  : '';
axios.defaults.baseURL = `${API_URL}/api`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true');
  const [backendError, setBackendError] = useState(false);
  const pendingRequests = useRef({}); // Track requests to prevent duplicates
  const requestTimeouts = useRef({}); // Track timeouts for requests

  useEffect(() => {
    axios.interceptors.request.use(
      config => {
        const requestKey = `${config.method}-${config.url}`;
        
        // If a request is already pending, cancel it
        if (pendingRequests.current[requestKey]) {
          console.log(`Request ${requestKey} already in progress, cancelling duplicate`);
          const source = axios.CancelToken.source();
          config.cancelToken = source.token;
          source.cancel('Duplicate request cancelled');
          return config;
        }

        // Mark the request as pending
        pendingRequests.current[requestKey] = true;

        // Set a timeout to clear the pending flag after 10 seconds
        requestTimeouts.current[requestKey] = setTimeout(() => {
          console.log(`Request ${requestKey} timed out, clearing pending status`);
          delete pendingRequests.current[requestKey];
          delete requestTimeouts.current[requestKey];
        }, 10000);

        return config;
      },
      error => Promise.reject(error)
    );

    // Clear pending requests once they are completed or failed
    axios.interceptors.response.use(
      response => {
        const requestKey = `${response.config.method}-${response.config.url}`;
        delete pendingRequests.current[requestKey];

        if (requestTimeouts.current[requestKey]) {
          clearTimeout(requestTimeouts.current[requestKey]);
          delete requestTimeouts.current[requestKey];
        }

        return response;
      },
      error => {
        const requestKey = `${error.config.method}-${error.config.url}`;
        delete pendingRequests.current[requestKey];

        if (requestTimeouts.current[requestKey]) {
          clearTimeout(requestTimeouts.current[requestKey]);
          delete requestTimeouts.current[requestKey];
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // Clear timeouts on unmount
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
      loadUser(0);
    } else {
      setLoading(false);
    }
  }, []); // Only run on mount

  // Load user data with retry logic and permanent fix for infinite loop
  const loadUser = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      // If token is invalid, remove it
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
      
      // If we haven't retried too many times, try again after a delay
      if (retryCount < 3) {
        setTimeout(() => {
          loadUser(retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        setLoading(false);
      }
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      // Clear guest mode if active
      if (isGuest) {
        localStorage.removeItem('isGuest');
        setIsGuest(false);
      }

      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      await loadUser(0); // Load the user after successful registration
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
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

  // Login user
  const login = async (formData) => {
    try {
      // Clear guest mode if active
      if (isGuest) {
        localStorage.removeItem('isGuest');
        setIsGuest(false);
      }

      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      await loadUser(0); // Load the user after successful login
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
    setBackendError(false);
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
        isGuest,
        backendError,
        retryBackend: () => { setLoading(true); loadUser(0); }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
