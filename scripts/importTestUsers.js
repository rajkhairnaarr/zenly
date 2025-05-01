const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema for the app
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Function to import users from test.users to our main app database
async function importTestUsers() {
  try {
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    const mongoUri = 'mongodb+srv://rajkhairnar6969:raj%40khairnar@zenly.0o2cxgm.mongodb.net/?retryWrites=true&w=majority&appName=zenly';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Get the database instance
    const db = mongoose.connection.db;
    console.log(`Connected to database: ${db.databaseName}`);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));
    
    // Check if users collection exists
    const hasUsersCollection = collections.some(c => c.name === 'users');
    
    if (!hasUsersCollection) {
      console.log('No users collection found in the database.');
      await mongoose.disconnect();
      return;
    }
    
    // Get all users from the collection
    const users = await db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users in the collection`);
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      await mongoose.disconnect();
      return;
    }
    
    // Create User model on the current connection
    const User = mongoose.model('User', UserSchema);
    
    // Import each user, checking for duplicates by email
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      try {
        // Check if user already exists in the main collection
        const existingUser = await User.findOne({ email: user.email });
        
        if (existingUser) {
          console.log(`User ${user.email} already exists, skipping`);
          skippedCount++;
          continue;
        }
        
        // Create a new user in the main collection
        const newUser = new User({
          name: user.name || 'Unknown User',
          email: user.email,
          password: user.password || 'password123', // Default password if not available
          role: user.role || 'user',
          createdAt: user.createdAt || new Date()
        });
        
        await newUser.save();
        console.log(`Imported user: ${user.email}`);
        importedCount++;
      } catch (err) {
        console.error(`Error importing user ${user.email || 'unknown'}:`, err.message);
        skippedCount++;
      }
    }
    
    console.log(`Import completed: ${importedCount} users imported, ${skippedCount} skipped.`);
    
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error importing users:', err);
  }
}

// Run the function
importTestUsers(); 