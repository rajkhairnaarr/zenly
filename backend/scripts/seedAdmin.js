const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zenly', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@zenly.com' });
    
    if (adminExists) {
      console.log('Admin user already exists.');
      mongoose.disconnect();
      return;
    }
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@zenly.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully:', admin.email);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin(); 