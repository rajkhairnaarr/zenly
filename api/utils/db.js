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

      // Default MongoDB Atlas URI - This should be replaced with your own in production environment variables
      const defaultMongoUri = 'mongodb+srv://rajkhairnar6969:raj%40khairnar@zenly.0o2cxgm.mongodb.net/?retryWrites=true&w=majority&appName=zenly';
      
      // Use environment variable if set, otherwise fallback to default Atlas URI
      const mongoUri = process.env.MONGODB_URI || defaultMongoUri;

      // Log connection attempt (hide credentials from logs)
      const sanitizedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
      console.log(`Attempting to connect to MongoDB at: ${sanitizedUri}`);
      
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