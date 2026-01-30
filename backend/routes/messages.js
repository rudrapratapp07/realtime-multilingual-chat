const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/messages/:userId
// @desc    Get messages between current user and another user
// @access  Private
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Verify other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Create room ID
    const room = Conversation.createRoomId(req.userId, userId);

    // Get messages
    const messages = await Message.find({ room })
      .populate('sender', 'username avatar preferredLanguage')
      .populate('receiver', 'username avatar preferredLanguage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Mark messages as read
    await Message.updateMany(
      { 
        room, 
        receiver: req.userId, 
        read: false 
      },
      { 
        read: true, 
        readAt: new Date() 
      }
    );

    res.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      hasMore: messages.length === parseInt(limit)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.userId,
      read: false
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/:messageId/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { 
        _id: req.params.messageId, 
        receiver: req.userId 
      },
      { 
        read: true, 
        readAt: new Date() 
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
