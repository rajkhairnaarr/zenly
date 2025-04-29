const { exec } = require('child_process');
const path = require('path');

// Check if PM2 is installed
exec('pm2 -v', (error) => {
  if (error) {
    console.log('PM2 is not installed. Installing PM2...');
    exec('npm install -g pm2', (installError) => {
      if (installError) {
        console.error('Failed to install PM2:', installError);
        return;
      }
      startServer();
    });
  } else {
    startServer();
  }
});

function startServer() {
  console.log('Starting Zenly backend with PM2...');
  
  // Start the server with PM2
  exec('pm2 start ecosystem.config.js', (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to start server:', error);
      return;
    }
    
    console.log('Server started successfully!');
    console.log(stdout);
    
    if (stderr) {
      console.error('PM2 stderr:', stderr);
    }
    
    // Save the PM2 process list so it restarts on system reboot
    exec('pm2 save', (saveError) => {
      if (saveError) {
        console.error('Failed to save PM2 process list:', saveError);
        return;
      }
      console.log('PM2 process list saved. Server will restart automatically on system reboot.');
    });
  });
} 