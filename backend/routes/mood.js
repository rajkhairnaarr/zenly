const express = require('express');
const router = express.Router();
const {
  getMoods,
  createMood,
  updateMood,
  deleteMood,
} = require('../controllers/mood');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getMoods)
  .post(protect, createMood);

router
  .route('/:id')
  .put(protect, updateMood)
  .delete(protect, deleteMood);

module.exports = router; 