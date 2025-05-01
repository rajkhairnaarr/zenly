import axios from 'axios';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Set token to localStorage and set axios default header
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth token set in axios defaults');
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    console.log('Auth token removed from axios defaults');
  }
};

// Login user and set token
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.token) {
      setToken(res.data.token);
      return res.data.user;
    }
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
};

// Login with admin credentials (for development/testing)
export const loginAsAdmin = async () => {
  try {
    console.log('Attempting admin login...');
    const result = await loginUser('admin@zenly.com', 'admin123');
    console.log('Admin login successful:', result);
    return result;
  } catch (err) {
    console.error('Admin login failed:', err);
    
    // For demo purposes, simulate a successful login
    const mockAdminToken = 'mock-admin-token-for-demo';
    setToken(mockAdminToken);
    console.log('Using mock admin token');
    
    return {
      id: 'admin-id',
      name: 'Admin User',
      email: 'admin@zenly.com',
      role: 'admin'
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Initialize auth from localStorage on app start
export const initAuth = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Add a random parameter to prevent caching
    axios.interceptors.request.use(config => {
      if (config.method === 'get') {
        // Add timestamp to GET requests to prevent caching
        config.params = {
          ...config.params,
          _t: Date.now()
        };
      }
      return config;
    });
    return true;
  }
  return false;
}; 