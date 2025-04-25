const Journal = require('../models/Journal');

// @desc    Get all journal entries for a user
// @route   GET /api/journal
// @access  Private
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort('-createdAt');
    res.json(journals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
exports.getJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Make sure user owns the journal entry
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(journal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new journal entry
// @route   POST /api/journal
// @access  Private
exports.createJournal = async (req, res) => {
  try {
    const journal = await Journal.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(journal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
exports.updateJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Make sure user owns the journal entry
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedJournal = await Journal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedJournal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Make sure user owns the journal entry
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await journal.remove();
    res.json({ message: 'Journal entry removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 