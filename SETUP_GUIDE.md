# 📚 Complete Setup Guide

This guide will walk you through setting up the Multilingual Chat Translator from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Getting Google Gemini API Key](#getting-google-gemini-api-key)
5. [Running the Application](#running-the-application)
6. [Testing the Application](#testing-the-application)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

1. **Node.js (v14 or higher)**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm (comes with Node.js)**
   - Verify installation: `npm --version`

3. **MongoDB (v4.4 or higher)**
   - **macOS:** 
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community
     ```
   - **Windows:** Download from https://www.mongodb.com/try/download/community
   - **Linux (Ubuntu/Debian):**
     ```bash
     wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
     echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
     sudo apt-get update
     sudo apt-get install -y mongodb-org
     ```
   - Verify installation: `mongod --version`

4. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Optional but Recommended

- **MongoDB Compass**: GUI for MongoDB (https://www.mongodb.com/products/compass)
- **Postman**: For API testing (https://www.postman.com/)
- **VS Code**: Recommended code editor (https://code.visualstudio.com/)

---

## System Requirements

### Minimum Requirements
- **OS:** Windows 10, macOS 10.14+, or Linux
- **RAM:** 4GB
- **Storage:** 1GB free space
- **Internet:** Active connection for Gemini API

### Recommended Requirements
- **OS:** Latest version of Windows, macOS, or Linux
- **RAM:** 8GB or more
- **Storage:** 2GB free space
- **Internet:** Stable broadband connection

---

## Step-by-Step Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to project directory
cd multilingual-chat-translator
```

If you don't have Git, you can download the ZIP file and extract it.

---

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install
```

This will install:
- Express.js (web framework)
- Socket.io (real-time communication)
- MongoDB/Mongoose (database)
- JWT (authentication)
- Google Generative AI (translation)
- And other dependencies...

**Expected output:**


```
added 150 packages, and audited 151 packages in 30s
```

#### 2.2 Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

Now open `.env` file in your text editor and fill in the values:

```env
# MongoDB - Use default for local development
MONGODB_URI=mongodb://localhost:27017/multilingual-chat

# JWT Secret - Generate a random string
JWT_SECRET=your_super_secret_jwt_key_here_make_it_random_and_long

# Google Gemini API Key - See next section
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port - Default is fine
PORT=5000

# Environment
NODE_ENV=development

# Frontend URL - Default is fine for local dev
CLIENT_URL=http://localhost:3000
```

**Generating a secure JWT_SECRET:**


```bash
# On Linux/macOS
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### Step 3: Get Google Gemini API Key

#### 3.1 Visit Google AI Studio

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account

#### 3.2 Create API Key

1. Click on "Create API Key" button
2. Select "Create API key in new project" (or choose an existing project)
3. Click "Create API key"
4. Copy the generated API key
5. Paste it in your `.env` file as `GEMINI_API_KEY`

**Important Notes:**
- Keep your API key secure - never commit it to Git
- The free tier has usage limits (check Google AI Studio for details)
- If you exceed limits, consider upgrading or implementing rate limiting

#### 3.3 Verify API Key

Test your API key:


```bash
# Create a test file
cat > test-gemini.js << 'EOF'
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function test() {
  try {
    const result = await model.generateContent('Translate "Hello" to Spanish');
    console.log('✅ API Key is working!');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('❌ API Key error:', error.message);
  }
}

test();
EOF

# Run the test
node test-gemini.js

# Clean up
rm test-gemini.js
```

---

### Step 4: Frontend Setup

#### 4.1 Install Frontend Dependencies

```bash
# Navigate to frontend folder (from project root)
cd ../frontend

# Install all dependencies
npm install
```

This will install:
- React and React DOM
- Ant Design (UI components)
- Socket.io-client (WebSocket)
- Axios (HTTP client)
- React Router (navigation)
- And other dependencies...

**Expected output:**


```
added 1200 packages, and audited 1201 packages in 45s
```

#### 4.2 Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

The default values should work for local development:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

### Step 5: Start MongoDB

#### macOS (with Homebrew)
```bash
# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb
```

#### Linux
```bash
# Start MongoDB
sudo systemctl start mongod

# Enable auto-start on boot (optional)
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

#### Windows
```bash
# Start MongoDB service
net start MongoDB

# Or start manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

#### Verify MongoDB is Running

```bash
# Connect to MongoDB shell
mongosh

# You should see MongoDB shell prompt
# Type 'exit' to quit
```

---

## Running the Application

### Option 1: Run Both Servers Separately (Recommended)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Expected output:**


```
🚀 Server running on port 5000
📡 Socket.io ready for connections
🌍 Environment: development
✅ MongoDB connected successfully
```

**Terminal 2 - Frontend:**


```bash
cd frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view multilingual-chat-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

The application will automatically open in your browser at http://localhost:3000

### Option 2: Production Build

```bash
# Build frontend
cd frontend
npm run build

# Serve the build (you'll need to configure backend to serve static files)
```

---

## Testing the Application

### 1. Create Test Accounts

1. Open http://localhost:3000
2. Click "Register here"
3. Create first user:
   - Username: `alice`
   - Email: `alice@example.com`
   - Password: `password123`
   - Language: English 🇬🇧
4. Logout
5. Register second user:
   - Username: `bob`
   - Email: `bob@example.com`
   - Password: `password123`
   - Language: Spanish 🇪🇸

### 2. Test Real-Time Chat

1. **In Browser 1 (Alice):**
   - Login as alice@example.com
   - Click on "bob" in contacts
   - Type: "Hello, how are you?"
   - Send message

2. **In Browser 2 (Bob - open in private/incognito window):**
   - Login as bob@example.com
   - Should see message from Alice
   - Message should be translated to Spanish: "Hola, ¿cómo estás?"
   - Reply: "Bien, gracias"
   - Send message

3. **In Browser 1 (Alice):**
   - Should receive Bob's message
   - Message should be translated to English: "Good, thanks"

### 3. Test Features

- ✅ Online/offline status indicators
- ✅ Typing indicators
- ✅ Read receipts (blue checkmark)
- ✅ Language switching (change in header dropdown)
- ✅ Message history persistence
- ✅ Real-time updates

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

**Error:**


```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**


```bash
# Check if MongoDB is running
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux
net start MongoDB                  # Windows

# If not running, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

---

### Issue 2: Port Already in Use

**Error:**


```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**


```bash
# Find process using port 5000
lsof -i :5000          # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>          # macOS/Linux
taskkill /PID <PID> /F # Windows

# Or change PORT in backend/.env to a different port
```

---

### Issue 3: Gemini API Error

**Error:**


```
Translation error: API key not valid
```

**Solutions:**
1. Verify API key in `.env` is correct
2. Check API key has not expired
3. Verify you haven't exceeded free tier limits
4. Try regenerating API key in Google AI Studio

---

### Issue 4: CORS Errors

**Error:**


```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**


1. Verify `CLIENT_URL` in backend `.env` matches your frontend URL
2. Restart backend server after changing `.env`
3. Clear browser cache

---

### Issue 5: Socket Connection Failed

**Error in browser console:**


```
WebSocket connection failed
```

**Solutions:**
1. Verify backend server is running
2. Check `REACT_APP_SOCKET_URL` in frontend `.env`
3. Disable browser extensions that might block WebSockets
4. Check firewall settings

---

### Issue 6: Dependencies Installation Failed

**Error:**


```
npm ERR! code ERESOLVE
```

**Solution:**


```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

---

### Issue 7: Module Not Found

**Error:**


```
Error: Cannot find module 'express'
```

**Solution:**


```bash
# Make sure you're in the right directory
cd backend  # or cd frontend

# Reinstall dependencies
npm install
```

---

## Verification Checklist

Before reporting issues, verify:

- [ ] Node.js v14+ installed (`node --version`)
- [ ] MongoDB running (`mongosh` connects successfully)
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Frontend dependencies installed (`frontend/node_modules` exists)
- [ ] Backend `.env` file exists and configured
- [ ] Frontend `.env` file exists and configured
- [ ] Valid Gemini API key in backend `.env`
- [ ] Backend server running on port 5000
- [ ] Frontend dev server running on port 3000
- [ ] No firewall blocking ports 3000, 5000, or 27017
- [ ] No other applications using these ports

---

## Next Steps

After successful setup:

1. **Explore the Code**
   - Review `backend/server.js` for server setup
   - Check `backend/socket/handlers.js` for Socket.io logic
   - Examine `frontend/src/components/Chat.js` for UI
   - Study `backend/services/translationService.js` for translation

2. **Customize**
   - Add more languages in both backend and frontend
   - Implement group chat functionality
   - Add file/image sharing
   - Enhance UI with custom themes
   - Add voice/video call features

3. **Deploy**
   - See deployment section in main README.md
   - Consider using MongoDB Atlas for database
   - Deploy backend to Heroku, Railway, or DigitalOcean
   - Deploy frontend to Vercel or Netlify

4. **Contribute**
   - Report issues on GitHub
   - Submit pull requests
   - Share your improvements

---

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md
2. Review API_DOCUMENTATION.md
3. Check browser console for errors
4. Check backend console logs
5. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

---

## Success!

If everything is working:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3000
- ✅ MongoDB connected
- ✅ Can register users
- ✅ Can login
- ✅ Can send messages
- ✅ Messages are being translated
- ✅ Real-time updates working

Congratulations! Your Multilingual Chat Translator is now fully functional! 🎉
