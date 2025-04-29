const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod = null;

/**
 * Start an in-memory MongoDB server and connect to it
 */
async function startMemoryServer() {
  try {
    // Create an in-memory MongoDB server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Set environment variable for other modules to use
    process.env.MONGODB_URI = uri;
    
    console.log('In-memory MongoDB server started at:', uri);
    
    // Connect to the in-memory database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to in-memory MongoDB');
    
    return { uri, mongod };
  } catch (error) {
    console.error('Failed to start in-memory MongoDB:', error);
    throw error;
  }
}

/**
 * Stop the in-memory MongoDB server
 */
async function stopMemoryServer() {
  if (mongod) {
    await mongoose.connection.close();
    await mongod.stop();
    console.log('In-memory MongoDB server stopped');
  }
}

module.exports = { startMemoryServer, stopMemoryServer }; 