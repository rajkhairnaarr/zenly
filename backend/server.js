const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create User model schema
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

// Create User model
const User = mongoose.model('User', UserSchema);

// Add Mood Schema after User Schema
const MoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'neutral', 'sad']
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  activities: {
    type: [String],
    default: []
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Mood model
const Mood = mongoose.model('Mood', MoodSchema);

// Middleware to authenticate requests
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'zenly_secret_key_2024');
    
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
    
    const user = await User.findById(verified.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin privileges required' });
  }
  next();
};

// Start MongoDB Memory Server and connect
async function startServer() {
  try {
    // Create an in-memory MongoDB instance
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB instance');

    // Create a default admin user
    const adminExists = await User.findOne({ email: 'admin@zenly.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@zenly.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin user created');
    }

    // Basic route
    app.get('/api', (req, res) => {
      res.json({ message: 'Welcome to Zenly API' });
    });

    // Auth routes
    // Register a new user
    app.post('/api/auth/register', async (req, res) => {
      try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
          return res.status(400).json({ message: 'Please enter all fields' });
        }
        
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword
        });
        
        // Create JWT token
        const token = jwt.sign(
          { id: newUser._id },
          process.env.JWT_SECRET || 'zenly_secret_key_2024',
          { expiresIn: '7d' }
        );
        
        res.status(201).json({
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }
        });
      } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration' });
      }
    });

    // Login user
    app.post('/api/auth/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
          return res.status(400).json({ message: 'Please enter all fields' });
        }
        
        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET || 'zenly_secret_key_2024',
          { expiresIn: '7d' }
        );
        
        res.json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
      }
    });

    // Get current user
    app.get('/api/auth/me', auth, (req, res) => {
      res.json(req.user);
    });

    // Meditation routes
    // Get all meditations
    app.get('/api/meditations', async (req, res) => {
      try {
        // Mock meditation data since we don't have a proper model
        const meditations = [
          {
            _id: '1',
            title: 'Breathing Meditation',
            description: 'Focus on your breath to calm your mind and body.',
            duration: 5
          },
          {
            _id: '2',
            title: 'Body Scan',
            description: 'Gradually focus your attention on different parts of your body.',
            duration: 10
          },
          {
            _id: '3',
            title: 'Loving-Kindness Meditation',
            description: 'Develop feelings of goodwill, kindness, and warmth towards others.',
            duration: 15
          }
        ];
        res.json(meditations);
      } catch (err) {
        console.error('Error fetching meditations:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Start meditation session
    app.post('/api/meditations/:id/start', auth, async (req, res) => {
      try {
        // Here we would normally log the session to a database
        // but for now we'll just return success
        res.json({ message: 'Meditation session started' });
      } catch (err) {
        console.error('Error starting meditation:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Mood routes
    // Get all moods for current user
    app.get('/api/mood', auth, async (req, res) => {
      try {
        const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(moods);
      } catch (err) {
        console.error('Error fetching moods:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Create a new mood entry
    app.post('/api/mood', auth, async (req, res) => {
      try {
        const { mood, intensity, activities, notes } = req.body;
        
        // Validate input
        if (!mood || !intensity) {
          return res.status(400).json({ message: 'Mood and intensity are required' });
        }
        
        const newMood = new Mood({
          user: req.user.id,
          mood,
          intensity,
          activities,
          notes
        });
        
        const savedMood = await newMood.save();
        res.status(201).json(savedMood);
      } catch (err) {
        console.error('Error creating mood entry:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Delete a mood entry
    app.delete('/api/mood/:id', auth, async (req, res) => {
      try {
        const mood = await Mood.findById(req.params.id);
        
        if (!mood) {
          return res.status(404).json({ message: 'Mood entry not found' });
        }
        
        // Check user owns the mood entry
        if (mood.user.toString() !== req.user.id) {
          return res.status(401).json({ message: 'Not authorized to delete this entry' });
        }
        
        await mood.deleteOne();
        res.json({ message: 'Mood entry removed' });
      } catch (err) {
        console.error('Error deleting mood entry:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Try different ports if the primary one is in use
    const tryListen = (port) => {
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        // Store the actual port used for reference
        app.set('port', port);
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying port ${port + 1}`);
          tryListen(port + 1);
        } else {
          console.error('Server error:', err);
        }
      });
    };

    // Start with port 5001 and try alternatives if needed
    const PORT = process.env.PORT || 5001;
    tryListen(PORT);
    
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();