# 🌍 Real-Time Multilingual Chat Translator

A full-stack real-time chat application that automatically translates messages between users speaking different languages using Google Gemini API, Socket.io, React, Node.js, Express, and MongoDB.

## ✨ Features

- **Real-time Messaging**: Instant bi-directional communication using Socket.io
- **Automatic Translation**: Messages are automatically translated to recipient's preferred language using Google Gemini API
- **12 Languages Supported**: English, Spanish, French, German, Chinese, Japanese, Arabic, Hindi, Portuguese, Russian, Korean, and Italian
- **User Authentication**: Secure JWT-based authentication
- **Language Preferences**: Each user can set their preferred language
- **Online Status**: Real-time online/offline status indicators
- **Typing Indicators**: See when someone is typing
- **Read Receipts**: Know when messages have been read
- **Chat History**: Persistent message storage in MongoDB
- **Modern UI**: Beautiful, responsive interface built with Ant Design

## 🏗️ Architecture

### Backend
- **Node.js & Express.js**: RESTful API server
- **Socket.io**: WebSocket server for real-time communication
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Secure authentication
- **Google Gemini API**: AI-powered translation service
- **bcryptjs**: Password hashing

### Frontend
- **React.js**: UI framework
- **Ant Design**: Component library
- **Socket.io-client**: WebSocket client
- **Axios**: HTTP client
- **React Router**: Navigation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Google Gemini API key

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rudrapratapp07/realtime-multilingual-chat.git
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` file and configure your environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/multilingual-chat
JWT_SECRET=your_secure_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Getting a Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Run the Application

**Terminal 1 - Backend:**


```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**


```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## 📖 Usage Guide

### 1. Register Account

1. Open http://localhost:3000
2. Click "Register here"
3. Fill in:
   - Username (min 3 characters)
   - Email
   - Password (min 6 characters)
   - Preferred Language
4. Click "Register"

### 2. Login

1. Enter your email and password
2. Click "Login"

### 3. Start Chatting

1. Select a user from the contacts list on the left
2. Type your message in your preferred language
3. Press Enter or click Send
4. Your message will be automatically translated to the recipient's language

### 4. Change Language

1. Click the language dropdown in the header
2. Select your new preferred language
3. All incoming messages will now be translated to this language

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/language` - Update preferred language

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search?query=<username>` - Search users
- `GET /api/users/conversations` - Get user's conversations

### Messages
- `GET /api/messages/:userId` - Get messages with specific user
- `GET /api/messages/unread/count` - Get unread message count
- `PUT /api/messages/:messageId/read` - Mark message as read

## 🔌 Socket Events

### Client → Server
- `room:join` - Join a chat room
- `room:leave` - Leave a chat room
- `message:send` - Send a message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `message:read` - Mark message as read

### Server → Client
- `room:joined` - Room joined successfully
- `message:received` - New message received
- `message:new` - Message update
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `user:online` - User came online
- `user:offline` - User went offline
- `message:read` - Message was read
- `error` - Error occurred

## 📁 Project Structure

```
multilingual-chat-translator/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Conversation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── messages.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── translationService.js
│   ├── socket/
│   │   └── handlers.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Chat.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🎯 Key Technologies & Libraries

### Backend Dependencies
- `express`: ^4.18.2 - Web framework
- `socket.io`: ^4.6.1 - Real-time communication
- `mongoose`: ^7.0.3 - MongoDB ODM
- `jsonwebtoken`: ^9.0.0 - JWT authentication
- `bcryptjs`: ^2.4.3 - Password hashing
- `@google/generative-ai`: ^0.1.3 - Google Gemini API
- `cors`: ^2.8.5 - CORS middleware
- `dotenv`: ^16.0.3 - Environment variables
- `express-validator`: ^7.0.1 - Request validation

### Frontend Dependencies
- `react`: ^18.2.0 - UI library
- `react-router-dom`: ^6.10.0 - Routing
- `socket.io-client`: ^4.6.1 - WebSocket client
- `antd`: ^5.4.0 - UI components
- `axios`: ^1.3.5 - HTTP client
- `@ant-design/icons`: ^5.0.1 - Icon library
- `dayjs`: ^1.11.7 - Date formatting

## 🔐 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication (7-day expiry)
- Protected API routes with authentication middleware
- Socket.io authentication for WebSocket connections
- Input validation using express-validator
- CORS configuration
- Secure password requirements (min 6 characters)

## 🌐 Supported Languages

| Language | Code | Flag |
|----------|------|------|
| English | en | 🇬🇧 |
| Spanish | es | 🇪🇸 |
| French | fr | 🇫🇷 |
| German | de | 🇩🇪 |
| Chinese | zh | 🇨🇳 |
| Japanese | ja | 🇯🇵 |
| Arabic | ar | 🇸🇦 |
| Hindi | hi | 🇮🇳 |
| Portuguese | pt | 🇵🇹 |
| Russian | ru | 🇷🇺 |
| Korean | ko | 🇰🇷 |
| Italian | it | 🇮🇹 |

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

### Port Already in Use

```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

### Translation Not Working
- Verify your Gemini API key is correct in `.env`
- Check API quota/limits in Google AI Studio
- Review backend console for translation errors

### Socket Connection Failed
- Ensure backend server is running
- Check CORS configuration
- Verify REACT_APP_SOCKET_URL in frontend `.env`

## 📝 Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/multilingual-chat
JWT_SECRET=your_jwt_secret_key_change_in_production
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables on hosting platform
2. Ensure MongoDB Atlas connection string is used
3. Update CLIENT_URL to production frontend URL

### Frontend Deployment (e.g., Vercel, Netlify)
1. Set REACT_APP_API_URL to production backend URL
2. Set REACT_APP_SOCKET_URL to production backend URL
3. Build: `npm run build`
4. Deploy `build` folder

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.
