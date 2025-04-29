// Simple test route that doesn't require database connection
const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ 
    message: 'Hello from the backend!',
    time: new Date().toISOString(),
    status: 'ok'
  });
});

module.exports = router; 