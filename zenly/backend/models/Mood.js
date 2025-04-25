const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    required: [true, 'Please add a mood'],
    enum: ['happy', 'neutral', 'sad'],
  },
  intensity: {
    type: Number,
    required: [true, 'Please add an intensity level'],
    min: 1,
    max: 10,
  },
  activities: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Mood', MoodSchema); 