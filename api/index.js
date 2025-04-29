// Import the Express app from server.js
const app = require('../backend/server.js');

// Make sure MongoDB connection is attempted
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zenly';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB in serverless function');
  } catch (err) {
    console.error('MongoDB connection error in serverless function:', err);
  }
};

// Connect to MongoDB before handling requests
connectDB();

// Export the app for Vercel serverless functions
module.exports = app; 