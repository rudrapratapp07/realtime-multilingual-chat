import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Join a chat room
  joinRoom(receiverId) {
    if (this.socket) {
      this.socket.emit('room:join', { receiverId });
    }
  }

  // Leave a chat room
  leaveRoom(room) {
    if (this.socket) {
      this.socket.emit('room:leave', { room });
    }
  }

  // Send a message
  sendMessage(receiverId, text) {
    if (this.socket) {
      this.socket.emit('message:send', { receiverId, text });
    }
  }

  // Typing indicators
  startTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('typing:start', { receiverId });
    }
  }

  stopTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('typing:stop', { receiverId });
    }
  }

  // Mark message as read
  markMessageRead(messageId, senderId) {
    if (this.socket) {
      this.socket.emit('message:read', { messageId, senderId });
    }
  }

  // Event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }
}

const socketService = new SocketService();
export default socketService;
