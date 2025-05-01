const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const getUserModel = require('../models/User');
const { connectToMongoDB } = require('../utils/db');

// Admin credentials
const ADMIN_EMAIL = 'admin@zenly.com';
const ADMIN_PASSWORD = 'admin1234';

const ensureApiAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectToMongoDB();
    console.log('Connected to MongoDB successfully.');

    const User = getUserModel();

    // Check if admin user already exists
    console.log('Checking for existing admin...');
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log(`Admin user already exists: ${existingAdmin.email}`);
      await mongoose.disconnect();
      return;
    }

    // Check if user with admin email exists
    console.log('No admin found. Checking for user with admin email...');
    const userWithAdminEmail = await User.findOne({ email: ADMIN_EMAIL });

    if (userWithAdminEmail) {
      console.log(`User with email ${ADMIN_EMAIL} found, updating role to admin...`);
      userWithAdminEmail.role = 'admin';
      await userWithAdminEmail.save();
      console.log('User role updated to admin.');
    } else {
      console.log(`No user with email ${ADMIN_EMAIL} found. Creating new admin...`);
      
      // Create new admin user
      // Note: Password will be hashed by the pre-save middleware in the User model
      const newAdmin = new User({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log(`Admin user created with email: ${ADMIN_EMAIL}`);
    }

    console.log('Admin user operation completed successfully.');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
    process.exit(1);
  }
};

// Run the function
ensureApiAdmin(); 