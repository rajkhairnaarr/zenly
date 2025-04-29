const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserQueries = require('../utils/userQueries');

// Handler for password change
module.exports = async (req, res) => {
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    let userId;
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET || 'zenly_secret_key_2024');
      userId = verified.id;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Get password data from request body
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    // Find user with password field included
    const user = await UserQueries.findUserByEmail(req.body.email || '');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Change password
    const success = await UserQueries.changePassword(userId, newPassword);
    
    if (!success) {
      return res.status(500).json({ message: 'Failed to update password' });
    }
    
    res.json({ message: 'Password updated successfully' });
    
  } catch (err) {
    console.error('Change password error:', {
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