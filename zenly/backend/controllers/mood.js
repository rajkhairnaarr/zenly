const Mood = require('../models/Mood');

// @desc    Get all moods
// @route   GET /api/mood
// @access  Private
exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Create new mood
// @route   POST /api/mood
// @access  Private
exports.createMood = async (req, res) => {
  try {
    const mood = await Mood.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(mood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update mood
// @route   PUT /api/mood/:id
// @access  Private
exports.updateMood = async (req, res) => {
  try {
    let mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Make sure user owns mood
    if (mood.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    mood = await Mood.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(mood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete mood
// @route   DELETE /api/mood/:id
// @access  Private
exports.deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Make sure user owns mood
    if (mood.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await mood.remove();

    res.status(200).json({ message: 'Mood entry removed' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 