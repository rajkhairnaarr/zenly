const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db'); // Assuming db connection logic is here
const User = require('../models/User');   // Assuming User model is here

// Load environment variables (especially MONGODB_URI)
// Make sure you have a .env file in the backend directory for local execution
// dotenv.config({ path: '../.env' }); // Changed path loading
dotenv.config(); // Load .env from the current working directory (backend)

const ADMIN_EMAIL = 'admin@zenly.com';
const ADMIN_PASSWORD = 'admin1234';

const ensureAdminUser = async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  try {
    // Check if any admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${existingAdmin.email}`);
      return; // Exit if admin already exists
    }

    console.log('No admin user found. Checking for user with admin email...');

    // Check if a user with the target admin email exists but is not admin
    let targetUser = await User.findOne({ email: ADMIN_EMAIL });

    if (targetUser) {
      console.log(`User with email ${ADMIN_EMAIL} found, updating role to admin...`);
      targetUser.role = 'admin';
      await targetUser.save();
      console.log(`User ${ADMIN_EMAIL} successfully updated to admin.`);
    } else {
      console.log(`User with email ${ADMIN_EMAIL} not found. Creating new admin user...`);
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      // Create the new admin user
      const newAdmin = await User.create({
        name: 'Admin', // Default name for the admin
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Admin user ${newAdmin.email} created successfully.`);
    }

  } catch (error) {
    console.error('Error ensuring admin user:', error);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

// Run the function
ensureAdminUser(); 