const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the appropriate connection string for the current environment
 */
async function connectToMongoDB() {
  try {
    // Only connect if not already connected
    if (mongoose.connection.readyState !== 1) {
      // Connection options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
      };

      // Determine the connection string based on environment
      let mongoUri;
      
      if (process.env.MONGODB_URI) {
        // Use the provided connection string if available
        mongoUri = process.env.MONGODB_URI;
      } else if (process.env.NODE_ENV === 'production') {
        // Fallback for production (would normally come from environment)
        mongoUri = 'mongodb://localhost:27017/zenly_production';
      } else if (process.env.NODE_ENV === 'test') {
        // Test environment uses an in-memory database
        mongoUri = 'mongodb://localhost:27017/zenly_test';
      } else {
        // Development environment
        mongoUri = 'mongodb://localhost:27017/zenly_development';
      }

      // Log connection attempt
      console.log(`Attempting to connect to MongoDB at: ${mongoUri.split('@').pop()}`);
      
      // Connect to the database
      await mongoose.connect(mongoUri, options);
      
      console.log('Successfully connected to MongoDB');
      
      // Set up connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    // For serverless environments, throw the error to fail fast and let Vercel retry
    if (process.env.VERCEL) {
      throw err;
    }
    
    // For other environments, log the error but don't crash the application
    console.error('Application continuing despite database connection failure');
  }
}

module.exports = { connectToMongoDB }; 