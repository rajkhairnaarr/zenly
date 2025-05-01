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
    enum: ['guided', 'music', 'nature', 'breathing', 'in-app'],
  },
  type: {
    type: String,
    required: [true, 'Please specify the meditation type'],
    enum: ['guided', 'in-app'],
    default: 'guided'
  },
  instructions: {
    type: [String],
    default: []
  },
  thumbnail: {
    type: String,
    default: ''
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