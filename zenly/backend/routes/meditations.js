const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', protect, (req, res) => {
  res.json({ message: 'Meditations route' });
});

module.exports = router; 