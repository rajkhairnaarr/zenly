const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zenly';
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB in me handler');
    }
  } catch (err) {
    console.error('MongoDB connection error in me handler:', err);
    throw err;
  }
}

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

  return mongoose.model('User', UserSchema);
};

// Handler for me endpoint
module.exports = async (req, res) => {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    try {
      // Verify token
      const verified = jwt.verify(token, process.env.JWT_SECRET || 'zenly_secret_key_2024');
      
      const User = getUserModel();
      // Get user from database (excluding password)
      const user = await User.findById(verified.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 