const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes'],
  },
  audioUrl: {
    type: String,
    required: [true, 'Please add an audio URL'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['guided', 'music', 'nature', 'breathing'],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Meditation', MeditationSchema); 