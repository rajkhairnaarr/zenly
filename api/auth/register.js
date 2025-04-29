const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserQueries = require('../utils/userQueries');

// Handler for register endpoint
module.exports = async (req, res) => {
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log request body (but omit password)
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '***';
    console.log('Registration request:', logBody);

    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    try {
      // Use the query utility to register user
      const newUser = await UserQueries.registerUser({
        name,
        email,
        password
      });
      
      // Create JWT token
      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET || 'zenly_secret_key_2024',
        { expiresIn: '7d' }
      );
      
      console.log('User registered successfully:', email);
      
      res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (err) {
      if (err.code === 'USER_EXISTS') {
        return res.status(400).json({ message: 'User already exists' });
      }
      throw err;
    }
  } catch (err) {
    console.error('Registration error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      message: 'Server error during registration: ' + err.message,
      details: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }
}; 