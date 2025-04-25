import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:5001/api');
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true');

  // Set up API base URL from backend port in localStorage
  useEffect(() => {
    const backendPort = localStorage.getItem('backendPort') || '5001';
    const newBaseUrl = `http://localhost:${backendPort}/api`;
    setApiBaseUrl(newBaseUrl);
    axios.defaults.baseURL = newBaseUrl;
    
    // Listen for changes to backendPort in localStorage
    const handleStorageChange = () => {
      const updatedPort = localStorage.getItem('backendPort') || '5001';
      const updatedBaseUrl = `http://localhost:${updatedPort}/api`;
      setApiBaseUrl(updatedBaseUrl);
      axios.defaults.baseURL = updatedBaseUrl;
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
  }, [apiBaseUrl]); // Re-run when API base URL changes

  // Load user data
  const loadUser = async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error loading user:', err);
      // Don't remove token or show error if backend is not available
      if (err.code === 'ERR_NETWORK') {
        console.log('Backend server not available, continuing in offline mode');
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
        apiBaseUrl,
        guestLogin,
        isGuest
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 