const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  audioUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['guided', 'breathing', 'sleep', 'focus', 'mindfulness'],
    default: 'guided'
  },
  type: {
    type: String,
    enum: ['guided', 'in-app'],
    default: 'guided'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meditation', MeditationSchema); 