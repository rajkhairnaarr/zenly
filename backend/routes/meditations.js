const express = require('express');
const router = express.Router();
const {
  getMeditations,
  getMeditation,
  createMeditation,
  updateMeditation,
  deleteMeditation,
} = require('../controllers/meditations');
const { protect, admin } = require('../middleware/auth');

router
  .route('/')
  .get(getMeditations)
  .post(protect, admin, createMeditation);

router
  .route('/:id')
  .get(getMeditation)
  .put(protect, admin, updateMeditation)
  .delete(protect, admin, deleteMeditation);

module.exports = router; 