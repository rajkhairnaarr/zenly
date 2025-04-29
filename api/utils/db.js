const mongoose = require('mongoose');

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Use a standard MongoDB connection string format that will work with free MongoDB instances
      // This is a free MongoDB instance from MongoDB Atlas with a properly formatted URI
      const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://admin:adminpassword@cluster0.cjcnkdq.mongodb.net/zenly_db?retryWrites=true&w=majority';
      
      // Connect with options appropriate for a serverless environment
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Lower values are better for serverless environments
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
      });
      console.log('Connected to MongoDB successfully');
    }
  } catch (err) {
    console.error('MongoDB connection error:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    throw err;
  }
}

module.exports = { connectToMongoDB }; 