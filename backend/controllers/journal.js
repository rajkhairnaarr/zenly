const Journal = require('../models/Journal');

// @desc    Get all journal entries for a user
// @route   GET /api/journal
// @access  Private
exports.getJournals = async (req, res) => {
  try {
    // Add pagination with defaults
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Create a query to allow filtering
    const query = { user: req.user._id };
    
    // Add tag filtering if requested
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }
    
    // Add mood filtering if requested
    if (req.query.mood) {
      query.mood = req.query.mood;
    }

    const journals = await Journal.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .select('-__v'); // Exclude version field

    // Get total count for pagination
    const total = await Journal.countDocuments(query);
    
    res.json({
      success: true,
      count: journals.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: journals
    });
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching journals' 
    });
  }
};

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
exports.getJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id).select('-__v');
    
    if (!journal) {
      return res.status(404).json({ 
        success: false,
        message: 'Journal entry not found' 
      });
    }

    // Make sure user owns the journal entry
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this journal entry' 
      });
    }

    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Error fetching journal:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching journal entry' 
    });
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
    
    res.status(201).json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Error creating journal:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating journal entry' 
    });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
exports.updateJournal = async (req, res) => {
  try {
    let journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ 
        success: false,
        message: 'Journal entry not found' 
      });
    }

    // Make sure user owns the journal entry
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to update this journal entry' 
      });
    }

    // Update only allowed fields
    const { title, content, mood, tags, isPrivate } = req.body;
    const updatedFields = {};
    
    if (title !== undefined) updatedFields.title = title;
    if (content !== undefined) updatedFields.content = content;
    if (mood !== undefined) updatedFields.mood = mood;
    if (tags !== undefined) updatedFields.tags = tags;
    if (isPrivate !== undefined) updatedFields.isPrivate = isPrivate;

    journal = await Journal.findByIdAndUpdate(
      req.params.id, 
      updatedFields, 
      {
        new: true,
        runValidators: true,
      }
    ).select('-__v');

    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Error updating journal:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating journal entry' 
    });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ 
        success: false,
        message: 'Journal entry not found' 
      });
    }

    // Make sure user owns the journal entry
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to delete this journal entry' 
      });
    }

    // Use findByIdAndDelete instead of remove() which is deprecated
    await Journal.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Journal entry removed successfully' 
    });
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting journal entry' 
    });
  }
}; 