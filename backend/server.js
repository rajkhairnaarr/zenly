const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: isProduction 
    ? ['https://zenly.vercel.app', 'https://zenly-frontend.vercel.app', 'https://zenly-frontend-rajkhairnaarrs-projects.vercel.app', 'https://fe-mu.vercel.app', 'https://zenly-neon.vercel.app', 'https://zenly-9gpp6xvdo-rajkhairnaarrs-projects.vercel.app'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
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

// Import Meditation model
const Meditation = require('./models/Meditation');

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

// Routes
const testRoute = require('./routes/test');
app.use('/api/test', testRoute);

// Add a simple test route that doesn't depend on MongoDB
const simpleTestRoute = require('./test-route');
app.use('/api/simple', simpleTestRoute);

// Start MongoDB connection
async function connectToMongoDB() {
  try {
    // Connect to MongoDB using the connection string from environment variable
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zenly';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

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
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't throw the error, just log it
    // This allows the app to continue even if MongoDB connection fails
    // The app will try to reconnect on the next request
  }
}

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
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
        
        // Create new user - password will be hashed by the pre-save middleware
        const newUser = await User.create({
          name,
          email,
          password
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
        res.status(500).json({ message: 'Server error during registration: ' + err.message });
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
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Validate password using the matchPassword method
        const isMatch = await user.matchPassword(password);
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
        res.status(500).json({ message: 'Server error during login: ' + err.message });
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
        const meditations = await Meditation.find().sort({ createdAt: -1 });
        res.json(meditations);
      } catch (err) {
        console.error('Error fetching meditations:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });
    
    // Get single meditation
    app.get('/api/meditations/:id', async (req, res) => {
      try {
        const meditation = await Meditation.findById(req.params.id);
        if (!meditation) {
          return res.status(404).json({ message: 'Meditation not found' });
        }
        res.json(meditation);
      } catch (err) {
        console.error('Error fetching meditation:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });
    
    // Create meditation (admin only)
    app.post('/api/meditations', auth, adminAuth, async (req, res) => {
      try {
        const { title, description, duration, audioUrl, category, type, isPremium } = req.body;
        
        // Create new meditation
        const meditation = new Meditation({
          title,
          description,
          duration,
          audioUrl,
          category,
          type,
          isPremium
        });
        
        const savedMeditation = await meditation.save();
        res.status(201).json(savedMeditation);
      } catch (err) {
        console.error('Error creating meditation:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });
    
    // Update meditation (admin only)
    app.put('/api/meditations/:id', auth, adminAuth, async (req, res) => {
      try {
        const { title, description, duration, audioUrl, category, type, isPremium } = req.body;
        
        // Find meditation
        let meditation = await Meditation.findById(req.params.id);
        if (!meditation) {
          return res.status(404).json({ message: 'Meditation not found' });
        }
        
        // Update fields
        meditation.title = title || meditation.title;
        meditation.description = description || meditation.description;
        meditation.duration = duration || meditation.duration;
        meditation.audioUrl = audioUrl || meditation.audioUrl;
        meditation.category = category || meditation.category;
        meditation.type = type || meditation.type;
        meditation.isPremium = isPremium !== undefined ? isPremium : meditation.isPremium;
        
        const updatedMeditation = await meditation.save();
        res.json(updatedMeditation);
      } catch (err) {
        console.error('Error updating meditation:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });
    
    // Delete meditation (admin only)
    app.delete('/api/meditations/:id', auth, adminAuth, async (req, res) => {
      try {
        const meditation = await Meditation.findById(req.params.id);
        if (!meditation) {
          return res.status(404).json({ message: 'Meditation not found' });
        }
        
        await meditation.deleteOne();
        res.json({ message: 'Meditation removed' });
      } catch (err) {
        console.error('Error deleting meditation:', err);
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

    // Add global error handling middleware
    app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ 
        message: 'Server error', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    });

    // Only start the server if we're not in a serverless environment
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
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
    } else {
      console.log('Running in Vercel serverless environment');
    }
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

// Export the Express app for Vercel
module.exports = app;

// Connect to MongoDB when the app is loaded, handle initial error
try {
  connectToMongoDB();
} catch (initialError) {
  console.error("CRITICAL: Initial MongoDB connection failed during module load:", initialError);
  // Note: In a serverless function, this might still prevent proper startup.
}

// Start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}