const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserQueries = require('../utils/userQueries');

// Handler for login endpoint
module.exports = async (req, res) => {
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log request body (but omit password)
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '***';
    console.log('Login request:', logBody);

    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    // Find user by email, including the password field
    console.log(`Looking for user with email: ${email}`);
    const user = await UserQueries.findUserByEmail(email, true);
    
    if (!user) {
      console.log(`Login failed: No user found with email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log(`User found: ${user.email}, role: ${user.role}, checking password...`);
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Login failed: Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Password matched, creating JWT token...');
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'zenly_secret_key_2024',
      { expiresIn: '7d' }
    );
    
    console.log('User logged in successfully:', email);
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      message: 'Server error during login: ' + err.message,
      details: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }
}; 