const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Get User model or create it if it doesn't exist
const getUserModel = () => {
  if (mongoose.models.User) {
    return mongoose.models.User;
  }

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

  // Encrypt password using bcrypt
  UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  // Match user entered password to hashed password in database
  UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  return mongoose.model('User', UserSchema);
};

module.exports = getUserModel; 