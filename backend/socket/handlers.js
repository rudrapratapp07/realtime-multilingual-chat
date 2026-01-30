const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const translationService = require('../services/translationService');

// Store active users
const activeUsers = new Map();

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Add user to active users
    activeUsers.set(socket.userId, socket.id);

    // Update user status to online
    User.findByIdAndUpdate(socket.userId, { 
      status: 'online',
      lastSeen: new Date()
    }).exec();

    // Broadcast user online status
    socket.broadcast.emit('user:online', { userId: socket.userId });

    // Join user's personal room
    socket.join(socket.userId);

    // Handle joining a chat room
    socket.on('room:join', async ({ receiverId }) => {
      try {
        const room = Conversation.createRoomId(socket.userId, receiverId);
        socket.join(room);
        
        console.log(`User ${socket.userId} joined room ${room}`);
        
        socket.emit('room:joined', { room, receiverId });
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle leaving a chat room
    socket.on('room:leave', ({ room }) => {
      socket.leave(room);
      console.log(`User ${socket.userId} left room ${room}`);
    });

    // Handle sending a message
    socket.on('message:send', async (data) => {
      try {
        const { receiverId, text } = data;

        // Get sender and receiver info
        const sender = await User.findById(socket.userId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        // Detect source language or use sender's preferred language
        const sourceLanguage = sender.preferredLanguage;
        const targetLanguage = receiver.preferredLanguage;

        // Translate message
        const translation = await translationService.translateMessage(
          text,
          sourceLanguage,
          targetLanguage
        );

        // Create room ID
        const room = Conversation.createRoomId(socket.userId, receiverId);

        // Save message to database
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          originalText: text,
          originalLanguage: sourceLanguage,
          translatedText: translation.translatedText,
          targetLanguage: targetLanguage,
          room
        });

        await message.save();

        // Populate sender and receiver info
        await message.populate('sender', 'username avatar preferredLanguage');
        await message.populate('receiver', 'username avatar preferredLanguage');

        // Update or create conversation
        let conversation = await Conversation.findOne({ room });
        
        if (!conversation) {
          conversation = new Conversation({
            participants: [socket.userId, receiverId],
            room,
            lastMessage: message._id,
            lastMessageAt: new Date()
          });
        } else {
          conversation.lastMessage = message._id;
          conversation.lastMessageAt = new Date();
        }
        
        await conversation.save();

        // Emit to sender (original message)
        socket.emit('message:received', {
          ...message.toObject(),
          isOwnMessage: true
        });

        // Emit to receiver (translated message)
        io.to(receiverId).emit('message:received', {
          ...message.toObject(),
          isOwnMessage: false
        });

        // Emit to room for real-time updates
        socket.to(room).emit('message:new', message);

        console.log(`Message sent from ${socket.userId} to ${receiverId}`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', ({ receiverId }) => {
      io.to(receiverId).emit('typing:start', { 
        userId: socket.userId,
        user: socket.user 
      });
    });

    socket.on('typing:stop', ({ receiverId }) => {
      io.to(receiverId).emit('typing:stop', { 
        userId: socket.userId 
      });
    });

    // Handle message read status
    socket.on('message:read', async ({ messageId, senderId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, {
          read: true,
          readAt: new Date()
        });

        io.to(senderId).emit('message:read', { messageId });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      // Remove from active users
      activeUsers.delete(socket.userId);

      // Update user status
      await User.findByIdAndUpdate(socket.userId, {
        status: 'offline',
        lastSeen: new Date()
      });

      // Broadcast user offline status
      socket.broadcast.emit('user:offline', { 
        userId: socket.userId 
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

module.exports = { setupSocketHandlers, activeUsers };
