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
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500
    },
    location: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    preferences: {
      darkMode: {
        type: Boolean,
        default: false
      },
      notificationsEnabled: {
        type: Boolean,
        default: true
      },
      language: {
        type: String,
        default: 'en'
      }
    },
    meditationStats: {
      totalSessions: {
        type: Number,
        default: 0
      },
      totalMinutes: {
        type: Number,
        default: 0
      },
      longestStreak: {
        type: Number,
        default: 0
      },
      currentStreak: {
        type: Number,
        default: 0
      }
    },
    lastActive: {
      type: Date,
      default: Date.now
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