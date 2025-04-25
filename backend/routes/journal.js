const express = require('express');
const router = express.Router();
const {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
} = require('../controllers/journal');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getJournals)
  .post(protect, createJournal);

router
  .route('/:id')
  .get(protect, getJournal)
  .put(protect, updateJournal)
  .delete(protect, deleteJournal);

module.exports = router; 