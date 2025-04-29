const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserQueries = require('../utils/userQueries');

// Handler for me endpoint
module.exports = async (req, res) => {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Get user profile request');
    
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    try {
      // Verify token
      const verified = jwt.verify(token, process.env.JWT_SECRET || 'zenly_secret_key_2024');
      
      // Get user from database (excluding password)
      const user = await UserQueries.findUserById(verified.id);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('User profile retrieved successfully:', user.email);
      
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    console.error('Error getting user details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      message: 'Server error: ' + err.message,
      details: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }
}; 