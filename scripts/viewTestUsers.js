const mongoose = require('mongoose');

// Connect to MongoDB Atlas and view users in test.users collection
async function viewTestUsers() {
  try {
    // MongoDB Atlas connection string
    const mongoUri = 'mongodb+srv://rajkhairnar6969:raj%40khairnar@zenly.0o2cxgm.mongodb.net/?retryWrites=true&w=majority&appName=zenly';
    
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas successfully!');

    // Get the database instance
    const db = mongoose.connection.db;
    
    // Check available databases and collections
    console.log('Checking available collections...');
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));

    // Access the 'users' collection directly
    console.log('\nFetching users from database...');
    const users = await db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users in the database`);
    
    // Display the user data (excluding password)
    console.table(users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    })));

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error viewing test users:', err);
  }
}

// Run the function
viewTestUsers(); 