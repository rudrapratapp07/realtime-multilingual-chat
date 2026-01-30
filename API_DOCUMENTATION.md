# API Documentation

Complete API reference for the Multilingual Chat Translator backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**


```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "preferredLanguage": "en"
}
```

**Validation Rules:**
- `username`: Required, minimum 3 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `preferredLanguage`: Optional, must be one of: en, es, fr, de, zh, ja, ar, hi, pt, ru, ko, it

**Success Response (201):**


```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "preferredLanguage": "en",
    "avatar": ""
  }
}
```

**Error Response (400):**


```json
{
  "success": false,
  "message": "User already exists with this email or username"
}
```

---

### Login

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**


```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**


```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "preferredLanguage": "en",
    "avatar": "",
    "status": "online"
  }
}
```

**Error Response (401):**


```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

Get the authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:**


```
Authorization: Bearer <token>
```

**Success Response (200):**


```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "preferredLanguage": "en",
    "avatar": "",
    "status": "online",
    "lastSeen": "2024-01-29T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-29T10:30:00.000Z"
  }
}
```

---

### Update Preferred Language

Change the user's preferred language for translations.

**Endpoint:** `PUT /auth/language`

**Headers:**


```
Authorization: Bearer <token>
```

**Request Body:**


```json
{
  "preferredLanguage": "es"
}
```

**Success Response (200):**


```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "preferredLanguage": "es",
    "avatar": "",
    "status": "online"
  }
}
```

---

## User Endpoints

### Get All Users

Retrieve all users except the current user.

**Endpoint:** `GET /users`

**Headers:**


```
Authorization: Bearer <token>
```

**Success Response (200):**


```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "username": "janedoe",
      "email": "jane@example.com",
      "preferredLanguage": "fr",
      "avatar": "",
      "status": "online",
      "lastSeen": "2024-01-29T10:25:00.000Z"
    }
  ]
}
```

---

### Search Users

Search for users by username.

**Endpoint:** `GET /users/search?query=<search_term>`

**Headers:**


```
Authorization: Bearer <token>
```

**Query Parameters:**
- `query`: Search term (required)

**Success Response (200):**


```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "username": "janedoe",
      "email": "jane@example.com",
      "preferredLanguage": "fr",
      "avatar": "",
      "status": "online"
    }
  ]
}
```

---

### Get Conversations

Retrieve all conversations for the current user.

**Endpoint:** `GET /users/conversations`

**Headers:**


```
Authorization: Bearer <token>
```

**Success Response (200):**


```json
{
  "success": true,
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "room": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "janedoe",
        "preferredLanguage": "fr"
      },
      "lastMessage": {
        "_id": "507f1f77bcf86cd799439014",
        "originalText": "Hello!",
        "translatedText": "Bonjour!",
        "createdAt": "2024-01-29T10:20:00.000Z"
      },
      "lastMessageAt": "2024-01-29T10:20:00.000Z"
    }
  ]
}
```

---

## Message Endpoints

### Get Messages

Retrieve messages between the current user and another user.

**Endpoint:** `GET /messages/:userId`

**Headers:**


```
Authorization: Bearer <token>
```

**Path Parameters:**
- `userId`: ID of the other user

**Query Parameters:**
- `limit`: Number of messages to retrieve (default: 50)
- `skip`: Number of messages to skip (default: 0)

**Success Response (200):**


```json
{
  "success": true,
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "sender": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "avatar": "",
        "preferredLanguage": "en"
      },
      "receiver": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "janedoe",
        "avatar": "",
        "preferredLanguage": "fr"
      },
      "originalText": "Hello!",
      "originalLanguage": "en",
      "translatedText": "Bonjour!",
      "targetLanguage": "fr",
      "room": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012",
      "read": true,
      "readAt": "2024-01-29T10:21:00.000Z",
      "createdAt": "2024-01-29T10:20:00.000Z",
      "updatedAt": "2024-01-29T10:21:00.000Z"
    }
  ],
  "hasMore": false
}
```

---

### Get Unread Message Count

Get the count of unread messages for the current user.

**Endpoint:** `GET /messages/unread/count`

**Headers:**


```
Authorization: Bearer <token>
```

**Success Response (200):**


```json
{
  "success": true,
  "count": 5
}
```

---

### Mark Message as Read

Mark a specific message as read.

**Endpoint:** `PUT /messages/:messageId/read`

**Headers:**


```
Authorization: Bearer <token>
```

**Path Parameters:**
- `messageId`: ID of the message to mark as read

**Success Response (200):**


```json
{
  "success": true,
  "message": {
    "_id": "507f1f77bcf86cd799439014",
    "read": true,
    "readAt": "2024-01-29T10:30:00.000Z"
  }
}
```

---

## Error Responses

### Validation Error (400)


```json
{
  "success": false,
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error (401)


```json
{
  "success": false,
  "message": "No authentication token, access denied"
}
```

### Not Found Error (404)


```json
{
  "success": false,
  "message": "User not found"
}
```

### Server Error (500)


```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Socket.io Events

### Client → Server Events

#### room:join
Join a chat room with another user.

**Payload:**


```javascript
{
  receiverId: "507f1f77bcf86cd799439012"
}
```

#### room:leave
Leave a chat room.

**Payload:**


```javascript
{
  room: "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012"
}
```

#### message:send
Send a message to another user.

**Payload:**


```javascript
{
  receiverId: "507f1f77bcf86cd799439012",
  text: "Hello, how are you?"
}
```

#### typing:start
Indicate that the user started typing.

**Payload:**


```javascript
{
  receiverId: "507f1f77bcf86cd799439012"
}
```

#### typing:stop
Indicate that the user stopped typing.

**Payload:**


```javascript
{
  receiverId: "507f1f77bcf86cd799439012"
}
```

#### message:read
Mark a message as read.

**Payload:**


```javascript
{
  messageId: "507f1f77bcf86cd799439014",
  senderId: "507f1f77bcf86cd799439011"
}
```

---

### Server → Client Events

#### room:joined
Confirmation that room was joined successfully.

**Payload:**


```javascript
{
  room: "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012",
  receiverId: "507f1f77bcf86cd799439012"
}
```

#### message:received
A new message was received.

**Payload:**


```javascript
{
  _id: "507f1f77bcf86cd799439014",
  sender: { ... },
  receiver: { ... },
  originalText: "Hello!",
  translatedText: "Bonjour!",
  isOwnMessage: false
}
```

#### typing:start
Another user started typing.

**Payload:**


```javascript
{
  userId: "507f1f77bcf86cd799439012",
  user: { username: "janedoe", ... }
}
```

#### typing:stop
Another user stopped typing.

**Payload:**


```javascript
{
  userId: "507f1f77bcf86cd799439012"
}
```

#### user:online
A user came online.

**Payload:**


```javascript
{
  userId: "507f1f77bcf86cd799439012"
}
```

#### user:offline
A user went offline.

**Payload:**


```javascript
{
  userId: "507f1f77bcf86cd799439012"
}
```

#### message:read
A message was marked as read.

**Payload:**


```javascript
{
  messageId: "507f1f77bcf86cd799439014"
}
```

#### error
An error occurred.

**Payload:**


```javascript
{
  message: "Failed to send message"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider implementing:
- API rate limiting (e.g., 100 requests per 15 minutes)
- Socket.io connection limits
- Message sending limits (e.g., 10 messages per minute)

---

## Google Gemini API Configuration

The translation service uses Google's Gemini Pro model. Configuration:

**Model:** `gemini-flash-latest`

**Translation Prompt Template:**


```
Translate the following text from {sourceLang} to {targetLang}. 
Provide ONLY the translation without any additional explanations, notes, or formatting.

Text to translate: "{text}"

Translation:
```

**Language Detection Prompt Template:**


```
Detect the language of the following text. 
Respond with ONLY the two-letter ISO 639-1 language code.
Do not provide any explanation, just the code.

Text: "{text}"

Language code:
```

**Fallback Behavior:**
If translation fails, the original text is returned with an error flag.

---

## Testing

### Using cURL

**Register:**


```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "preferredLanguage": "en"
  }'
```

**Login:**


```bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Users:**


```bash
curl -X GET http://localhost:5000/api/users \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## WebSocket Connection Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.emit('room:join', { receiverId: 'USER_ID' });

socket.on('message:received', (message) => {
  console.log('New message:', message);
});
```
