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
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    // MongoDB Atlas connection string
    const mongoUri = 'mongodb+srv://rajkhairnar6969:raj%40khairnar@zenly.0o2cxgm.mongodb.net/?retryWrites=true&w=majority&appName=zenly';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
    });
    console.log('Connected to MongoDB Atlas successfully!');

    // Create the database if it doesn't exist by using the db
    const db = mongoose.connection.db;
    console.log(`Connected to database: ${db.databaseName}`);
    
    // First check if we can access the meditations collection
    try {
      console.log("Checking if Meditation collection exists...");
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log("Available collections:", collectionNames.join(", "));
      
      // Check if there are already meditations
      console.log("Counting existing meditations...");
      const existingCount = await Meditation.countDocuments();
      if (existingCount > 0) {
        console.log(`${existingCount} meditations already exist in the database.`);
        console.log('Deleting existing meditations to avoid duplicates...');
        await Meditation.deleteMany({});
      }
      
      // Insert sample meditations
      console.log("Inserting new meditations...");
      const result = await Meditation.insertMany(sampleMeditations);
      console.log(`${result.length} sample meditations created!`);
    
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (err) {
      console.error('Error working with Meditation collection:', err);
      await mongoose.disconnect();
    }
  } catch (err) {
    console.error('Error creating sample meditations:', err);
  }
}

// Run the function
createMeditations(); 