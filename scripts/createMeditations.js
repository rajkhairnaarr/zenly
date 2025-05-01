const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Meditation model
const Meditation = require('../backend/models/Meditation');

const sampleMeditations = [
  {
    title: 'Breathing Awareness',
    description: 'A simple meditation focusing on breath to calm the mind and body.',
    duration: 5,
    audioUrl: 'https://example.com/meditations/breathing.mp3',
    category: 'breathing',
    type: 'guided',
    isPremium: false
  },
  {
    title: 'Body Scan Relaxation',
    description: 'Progressive relaxation by scanning through different parts of your body.',
    duration: 10,
    audioUrl: 'https://example.com/meditations/bodyscan.mp3',
    category: 'guided',
    type: 'guided',
    isPremium: false
  },
  {
    title: 'Sleep Well',
    description: 'Gentle guidance into restful sleep with calming visualizations.',
    duration: 20,
    audioUrl: 'https://example.com/meditations/sleep.mp3',
    category: 'sleep',
    type: 'guided',
    isPremium: true
  },
  {
    title: 'Mindful Focus',
    description: 'Improve concentration and presence with this mindfulness practice.',
    duration: 15,
    audioUrl: 'https://example.com/meditations/focus.mp3',
    category: 'focus',
    type: 'in-app',
    isPremium: false
  }
];

// Connect to MongoDB
async function createMeditations() {
  try {
    // Try multiple MongoDB connection options
    const mongoUris = [
      process.env.MONGODB_URI,
      'mongodb://localhost:27017/zenly',
      'mongodb://127.0.0.1:27017/zenly'
    ].filter(Boolean); // Remove undefined/null values
    
    let lastError = null;
    let connected = false;
    
    // Try each connection URI
    for (const uri of mongoUris) {
      try {
        console.log(`Attempting to connect to MongoDB at: ${uri.includes('@') ? uri.split('@')[0] + '@...' : uri}`);
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB successfully!');
        connected = true;
        break;
      } catch (err) {
        console.log(`Connection failed for URI: ${uri}`);
        lastError = err;
      }
    }
    
    if (!connected) {
      throw lastError || new Error('All MongoDB connection attempts failed');
    }

    // Check if there are already meditations
    const existingCount = await Meditation.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} meditations already exist in the database.`);
      console.log('Deleting existing meditations to avoid duplicates...');
      await Meditation.deleteMany({});
    }

    // Insert sample meditations
    const result = await Meditation.insertMany(sampleMeditations);
    console.log(`${result.length} sample meditations created!`);
    console.log('Sample meditation data:');
    console.log(result);

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error creating sample meditations:', err);
  }
}

// Run the function
createMeditations(); 