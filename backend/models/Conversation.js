const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  room: {
    type: String,
    required: true,
    unique: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create room ID from participant IDs
conversationSchema.statics.createRoomId = function(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
};

module.exports = mongoose.model('Conversation', conversationSchema);
