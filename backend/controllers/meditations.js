const Meditation = require('../models/Meditation');

// @desc    Get all meditations
// @route   GET /api/meditations
// @access  Public
exports.getMeditations = async (req, res) => {
  try {
    const meditations = await Meditation.find();
    res.json(meditations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single meditation
// @route   GET /api/meditations/:id
// @access  Public
exports.getMeditation = async (req, res) => {
  try {
    const meditation = await Meditation.findById(req.params.id);
    if (!meditation) {
      return res.status(404).json({ message: 'Meditation not found' });
    }
    res.json(meditation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create meditation
// @route   POST /api/meditations
// @access  Private/Admin
exports.createMeditation = async (req, res) => {
  try {
    const meditation = await Meditation.create(req.body);
    res.status(201).json(meditation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update meditation
// @route   PUT /api/meditations/:id
// @access  Private/Admin
exports.updateMeditation = async (req, res) => {
  try {
    const meditation = await Meditation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!meditation) {
      return res.status(404).json({ message: 'Meditation not found' });
    }
    res.json(meditation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete meditation
// @route   DELETE /api/meditations/:id
// @access  Private/Admin
exports.deleteMeditation = async (req, res) => {
  try {
    const meditation = await Meditation.findByIdAndDelete(req.params.id);
    if (!meditation) {
      return res.status(404).json({ message: 'Meditation not found' });
    }
    res.json({ message: 'Meditation removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 