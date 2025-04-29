const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUserModel = require('../models/User');

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Use a valid MongoDB Atlas URI with fallback
      const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://zenly:zenly123@cluster0.mongodb.net/zenly?retryWrites=true&w=majority';
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB in register handler');
    }
  } catch (err) {
    console.error('MongoDB connection error in register handler:', err);
    throw err;
  }
}

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

    // Connect to MongoDB
    await connectToMongoDB();
    
    const User = getUserModel();
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = await User.create({
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