const mongoose = require('mongoose');
const getUserModel = require('../models/User');
const { connectToMongoDB } = require('./db');

/**
 * Query utility for user operations
 */
const UserQueries = {
  /**
   * Register a new user
   * @param {Object} userData - User data including name, email, password
   * @returns {Object} New user object and token
   */
  async registerUser(userData) {
    await connectToMongoDB();
    const User = getUserModel();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      const error = new Error('User already exists');
      error.code = 'USER_EXISTS';
      throw error;
    }
    
    // Create new user
    const newUser = await User.create(userData);
    
    return newUser;
  },
  
  /**
   * Find user by email
   * @param {string} email - User email
   * @param {boolean} [includePassword=false] - Whether to include the password field
   * @returns {Object} User object if found
   */
  async findUserByEmail(email, includePassword = false) {
    await connectToMongoDB();
    const User = getUserModel();

    let query = User.findOne({ email });
    if (includePassword) {
      query = query.select('+password');
    }

    const user = await query;
    return user;
  },
  
  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Object} User object if found
   */
  async findUserById(id) {
    await connectToMongoDB();
    const User = getUserModel();
    
    const user = await User.findById(id).select('-password');
    return user;
  },
  
  /**
   * Update user information
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user object
   */
  async updateUser(id, updateData) {
    await connectToMongoDB();
    const User = getUserModel();
    
    // Don't allow updating these fields directly
    delete updateData.password;
    delete updateData.role;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    return updatedUser;
  },
  
  /**
   * Change user password
   * @param {string} id - User ID
   * @param {string} newPassword - New password
   * @returns {boolean} Success status
   */
  async changePassword(id, newPassword) {
    await connectToMongoDB();
    const User = getUserModel();
    
    const user = await User.findById(id);
    if (!user) {
      return false;
    }
    
    user.password = newPassword;
    await user.save();
    
    return true;
  },
  
  /**
   * Count total users
   * @returns {number} Count of users
   */
  async countUsers() {
    await connectToMongoDB();
    const User = getUserModel();
    
    return await User.countDocuments();
  }
};

module.exports = UserQueries; 