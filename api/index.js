const { connectToMongoDB } = require('./utils/db');

// Initialize database connection when the serverless function is loaded
connectToMongoDB()
  .then(() => console.log('Database connection initialized in index.js'))
  .catch(err => console.error('Failed to initialize database connection:', err));

// Simple endpoint to check if the API is working
module.exports = (req, res) => {
  res.json({ 
    message: 'Welcome to Zenly API - Go to /api/auth/register for registration',
    status: 'online',
    timestamp: new Date().toISOString()
  });
}; 