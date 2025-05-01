const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create User schema
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

// Encrypt password middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create User model
const User = mongoose.model('User', UserSchema);

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@zenly.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Sara Johnson',
    email: 'sara@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Mike Wilson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Connect to MongoDB
async function createUsers() {
  try {
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    // MongoDB Atlas connection string
    const mongoUri = 'mongodb+srv://rajkhairnar6969:raj%40khairnar@zenly.0o2cxgm.mongodb.net/?retryWrites=true&w=majority&appName=zenly';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Check if the admin user already exists
    const adminExists = await User.findOne({ email: 'admin@zenly.com' });
    
    if (adminExists) {
      console.log('Admin user already exists, checking other users...');
    } else {
      console.log('Admin user does not exist, will create all users');
    }
    
    // Create each user if they don't exist
    let createdCount = 0;
    for (const userData of sampleUsers) {
      const userExists = await User.findOne({ email: userData.email });
      
      if (!userExists) {
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.name} (${userData.email})`);
        createdCount++;
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }
    
    console.log(`Created ${createdCount} new users.`);
    
    // List all users in the database
    const users = await User.find().select('-password');
    console.log(`\nTotal users in database: ${users.length}`);
    console.table(users.map(u => ({
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    })));
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error creating sample users:', err);
  }
}

// Run the function
createUsers(); 