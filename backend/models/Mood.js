const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    required: [true, 'Please select a mood'],
    enum: ['happy', 'calm', 'neutral', 'anxious', 'sad', 'angry'],
  },
  intensity: {
    type: Number,
    required: [true, 'Please rate the intensity'],
    min: 1,
    max: 10,
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
  activities: [{
    type: String,
    enum: ['meditation', 'exercise', 'reading', 'social', 'work', 'rest'],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Mood', MoodSchema); 