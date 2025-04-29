const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserQueries = require('../utils/userQueries');

// Handler for user profile operations
module.exports = async (req, res) => {
  try {
    // Extract token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    try {
      // Verify token
      const verified = jwt.verify(token, process.env.JWT_SECRET || 'zenly_secret_key_2024');
      const userId = verified.id;
      
      // GET - Retrieve user profile
      if (req.method === 'GET') {
        const user = await UserQueries.findUserById(userId);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        return res.json({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        });
      }
      
      // PUT/PATCH - Update user profile
      if (req.method === 'PUT' || req.method === 'PATCH') {
        const { name } = req.body;
        
        if (!name) {
          return res.status(400).json({ message: 'Name is required' });
        }
        
        const updatedUser = await UserQueries.updateUser(userId, { name });
        
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        return res.json({
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          updatedAt: new Date()
        });
      }
      
      // Method not allowed
      return res.status(405).json({ message: 'Method not allowed' });
      
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      throw err;
    }
  } catch (err) {
    console.error('User profile error:', {
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