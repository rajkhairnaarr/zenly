const Mood = require('../models/Mood');

// @desc    Get all moods for a user
// @route   GET /api/mood
// @access  Private
exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort('-createdAt');
    res.json(moods);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new mood entry
// @route   POST /api/mood
// @access  Private
exports.createMood = async (req, res) => {
  try {
    const mood = await Mood.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(mood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update mood entry
// @route   PUT /api/mood/:id
// @access  Private
exports.updateMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Make sure user owns the mood entry
    if (mood.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedMood = await Mood.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete mood entry
// @route   DELETE /api/mood/:id
// @access  Private
exports.deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Make sure user owns the mood entry
    if (mood.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await mood.remove();
    res.json({ message: 'Mood entry removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 