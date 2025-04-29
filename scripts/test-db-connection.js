const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas URI (use environment variable or default)
const uri = process.env.MONGODB_URI || 'mongodb+srv://zenly-user:password123@cluster0.mongodb.net/zenly?retryWrites=true&w=majority';

console.log('Testing MongoDB connection...');
console.log(`Using URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

async function testConnection() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Create a simple test document
    const TestModel = mongoose.model('TestConnection', new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    }));
    
    // Insert a test document
    const testDoc = await TestModel.create({ name: 'connection_test' });
    console.log(`✅ Test document created with ID: ${testDoc._id}`);
    
    // Clean up - delete the test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document deleted');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection test failed:');
    console.error(error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    console.log(`\nTest ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  }); 