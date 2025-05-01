const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get MongoDB Atlas connection string from user
console.log('\n=== MongoDB Atlas Connection Setup ===');
console.log('This script will help you set up your MongoDB Atlas connection');
console.log('You can find your connection string in the MongoDB Atlas dashboard');
console.log('It should look like: mongodb+srv://username:password@cluster.mongodb.net/dbname\n');

// Function to test MongoDB connection
async function testConnection(connectionString) {
  try {
    console.log('Testing connection...');
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connection successful!');
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

// Ask for connection string
function getConnectionString() {
  rl.question('Enter your MongoDB Atlas connection string: ', async (connectionString) => {
    if (!connectionString || !connectionString.startsWith('mongodb+srv://')) {
      console.log('❌ Invalid connection string. It must start with mongodb+srv://');
      return getConnectionString();
    }
    
    // Test the connection
    const success = await testConnection(connectionString);
    
    if (success) {
      // Update files with the connection string
      updateConnectionStrings(connectionString);
      rl.close();
    } else {
      console.log('Please check your connection string and try again.');
      getConnectionString();
    }
  });
}

// Update connection strings in files
function updateConnectionStrings(connectionString) {
  // List of files to update
  const files = [
    {
      path: path.join(__dirname, 'server.js'),
      pattern: /const mongoUri = ['"]mongodb\+srv:\/\/.*?['"]/,
      replacement: `const mongoUri = '${connectionString}'`
    },
    {
      path: path.join(__dirname, '..', 'scripts', 'createTestUsers.js'),
      pattern: /const mongoUri = ['"]mongodb\+srv:\/\/.*?['"]/,
      replacement: `const mongoUri = '${connectionString}'`
    },
    {
      path: path.join(__dirname, '..', 'scripts', 'createMeditations.js'),
      pattern: /const mongoUri = ['"]mongodb\+srv:\/\/.*?['"]/,
      replacement: `const mongoUri = '${connectionString}'`
    }
  ];
  
  for (const file of files) {
    try {
      if (fs.existsSync(file.path)) {
        let content = fs.readFileSync(file.path, 'utf8');
        content = content.replace(file.pattern, file.replacement);
        fs.writeFileSync(file.path, content);
        console.log(`✅ Updated ${file.path}`);
      } else {
        console.log(`❓ File not found: ${file.path}`);
      }
    } catch (err) {
      console.error(`❌ Error updating ${file.path}:`, err.message);
    }
  }
  
  console.log('\n✅ MongoDB connection setup completed!');
  console.log('You can now run the server and scripts with your MongoDB Atlas connection.');
}

// Start the setup process
getConnectionString(); 