const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  mood: {
    type: String,
    enum: ['happy', 'calm', 'neutral', 'anxious', 'sad', 'angry'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPrivate: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Journal', JournalSchema); 