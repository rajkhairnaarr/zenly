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
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
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
    return await loginUser('admin@zenly.com', 'admin123');
  } catch (err) {
    console.error('Admin login failed:', err);
    
    // For demo purposes, simulate a successful login
    const mockAdminToken = 'mock-admin-token-for-demo';
    setToken(mockAdminToken);
    
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
    return true;
  }
  return false;
}; 