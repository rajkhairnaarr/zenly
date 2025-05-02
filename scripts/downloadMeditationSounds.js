/**
 * Script to download meditation sounds for the Zenly app
 * 
 * Run with: node downloadMeditationSounds.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const soundsDir = path.join(__dirname, '../frontend/public/sounds');

// Create sounds directory if it doesn't exist
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log(`Created directory: ${soundsDir}`);
}

// Sample meditation sounds - replace with appropriate URLs in a production environment
// For demo purposes, we're using sample free sounds from Pixabay and other free sources
const soundUrls = [
  {
    name: 'meditation-bells.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_ee19c40dba.mp3?filename=tibetan-bells-14s-333315.mp3'
  },
  {
    name: 'nature-ambience.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_bcad5fbbb7.mp3?filename=morning-garden-ambient-birds-nature-7799.mp3'
  },
  {
    name: 'singing-bowls.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/01/audio_7d5c2c7c46.mp3?filename=singing-bowl-harmonic-49283.mp3'
  },
  {
    name: 'ocean-waves.mp3', 
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_7b459b3ca0.mp3?filename=ocean-waves-112906.mp3'
  },
  {
    name: 'rainforest.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/03/audio_884fe606ad.mp3?filename=tropical-forest-with-birds-and-insects-148572.mp3'
  },
  {
    name: 'wind-chimes.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2021/04/29/audio_d7393bef6d.mp3?filename=wind-chimes-a-17221.mp3'
  }
];

// Download function
const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
};

// Download all sounds
async function downloadAllSounds() {
  console.log('Starting to download meditation sounds...');
  
  for (const sound of soundUrls) {
    const filePath = path.join(soundsDir, sound.name);
    
    if (fs.existsSync(filePath)) {
      console.log(`File ${sound.name} already exists, skipping...`);
      continue;
    }
    
    try {
      console.log(`Downloading ${sound.name}...`);
      await downloadFile(sound.url, filePath);
      console.log(`Successfully downloaded ${sound.name}`);
    } catch (error) {
      console.error(`Error downloading ${sound.name}:`, error.message);
    }
  }
  
  console.log('Download process complete!');
}

// Run the download
downloadAllSounds().catch(err => {
  console.error('Script failed:', err);
}); 