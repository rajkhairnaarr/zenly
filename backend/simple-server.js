const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS for all origins in this test server
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Simple health check endpoint that doesn't require database
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// MongoDB connection status
app.get('/api/db-status', async (req, res) => {
  try {
    // Check if mongoose is connected
    const status = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // If not connected, try to connect
    if (status !== 1) {
      const mongoUri = process.env.MONGODB_URI;
      
      if (!mongoUri) {
        return res.status(500).json({
          status: 'error',
          message: 'MONGODB_URI environment variable is not set',
          readyState: status,
          readyStateText: states[status]
        });
      }
      
      res.json({
        status: 'pending',
        message: 'Attempting to connect to MongoDB...',
        readyState: status,
        readyStateText: states[status],
        uriProvided: !!mongoUri,
        uriPrefix: mongoUri ? mongoUri.substring(0, 15) + '...' : null
      });
      
      // Try connecting (but don't wait for it in this response)
      mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => {
        console.log('MongoDB connected successfully');
      }).catch(err => {
        console.error('MongoDB connection error:', err);
      });
      
      return;
    }
    
    // If already connected
    res.json({
      status: 'success',
      message: 'Connected to MongoDB',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      readyState: status,
      readyStateText: states[status]
    });
  } catch (error) {
    console.error('Error checking DB status:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error route for testing
app.get('/api/error', (req, res) => {
  try {
    throw new Error('This is a test error');
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Catch all route
app.get('*', (req, res) => {
  res.json({
    message: `Received request at ${req.originalUrl}`,
    method: req.method,
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({
    status: 'error',
    message: err.message,
    path: req.path,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Simple test server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI provided: ${!!process.env.MONGODB_URI}`);
});

// Export for Vercel
module.exports = app; 