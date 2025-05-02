/**
 * Script to download meditation sounds for the Zenly app
 * 
 * Run with: node downloadMeditationSounds.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const soundsDir = path.join(__dirname, '../frontend/public/sounds');

// Create sounds directory if it doesn't exist
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log(`Created directory: ${soundsDir}`);
}

// Updated meditation sounds with direct links to reliable sources
const soundUrls = [
  {
    name: 'meditation-bells.mp3',
    url: 'https://soundbible.com/grab.php?id=2206&type=mp3',
    fallbackUrl: 'https://www.soundjay.com/bell/sounds/tibetan-bell-sound-1.mp3'
  },
  {
    name: 'nature-ambience.mp3',
    url: 'https://www.soundjay.com/nature/sounds/forest-birds-1.mp3',
    fallbackUrl: 'https://soundbible.com/grab.php?id=2202&type=mp3'
  },
  {
    name: 'singing-bowls.mp3',
    url: 'https://soundbible.com/grab.php?id=2218&type=mp3',
    fallbackUrl: 'https://www.soundjay.com/nature/sounds/singing-bowl-2.mp3'
  },
  {
    name: 'ocean-waves.mp3', 
    url: 'https://soundbible.com/grab.php?id=2120&type=mp3',
    fallbackUrl: 'https://www.soundjay.com/nature/sounds/ocean-wave-2.mp3'
  },
  {
    name: 'rainforest.mp3',
    url: 'https://soundbible.com/grab.php?id=2197&type=mp3',
    fallbackUrl: 'https://www.soundjay.com/nature/sounds/jungle-ambience-1.mp3'
  },
  {
    name: 'wind-chimes.mp3',
    url: 'https://soundbible.com/grab.php?id=2219&type=mp3',
    fallbackUrl: 'https://www.soundjay.com/nature/sounds/wind-chimes-1.mp3'
  }
];

// Improved download function that handles both http and https
const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    // Delete existing file if it's smaller than 10KB (likely corrupt)
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size < 10 * 1024) {
        fs.unlinkSync(filePath);
        console.log(`Deleted small/corrupted file: ${filePath}`);
      } else {
        console.log(`File ${path.basename(filePath)} already exists and looks valid. Skipping.`);
        return resolve();
      }
    }
    
    const file = fs.createWriteStream(filePath);
    console.log(`Starting download from ${url}`);
    
    // Choose http or https based on URL
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        fs.unlink(filePath, () => {});
        console.log(`Following redirect to: ${response.headers.location}`);
        downloadFile(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Check if we got a valid response
      if (response.statusCode !== 200) {
        fs.unlink(filePath, () => {});
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        
        // Verify we have a valid audio file (at least 10KB)
        fs.stat(filePath, (err, stats) => {
          if (err) {
            reject(err);
          } else if (stats.size < 10 * 1024) {
            console.warn(`Warning: File ${path.basename(filePath)} is suspiciously small (${stats.size} bytes)`);
          }
          resolve();
        });
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
    
    // Set a timeout
    request.setTimeout(30000, function() {
      request.abort();
      fs.unlink(filePath, () => {});
      reject(new Error('Request timeout'));
    });
  });
};

// Download all sounds with fallbacks
async function downloadAllSounds() {
  console.log('Starting to download meditation sounds...');
  
  for (const sound of soundUrls) {
    const filePath = path.join(soundsDir, sound.name);
    
    try {
      console.log(`Downloading ${sound.name}...`);
      try {
        await downloadFile(sound.url, filePath);
        console.log(`Successfully downloaded ${sound.name}`);
      } catch (error) {
        console.warn(`Error downloading ${sound.name} from primary source: ${error.message}`);
        console.log(`Trying fallback source for ${sound.name}...`);
        await downloadFile(sound.fallbackUrl, filePath);
        console.log(`Successfully downloaded ${sound.name} from fallback source`);
      }
      
      // Quick validation of file size
      const stats = fs.statSync(filePath);
      if (stats.size < 10 * 1024) {
        throw new Error(`Downloaded file is too small: ${stats.size} bytes`);
      }
    } catch (error) {
      console.error(`Failed to download ${sound.name}: ${error.message}`);
    }
  }
  
  console.log('Download process complete!');
}

// Run the download
downloadAllSounds().catch(err => {
  console.error('Script failed:', err);
}); 