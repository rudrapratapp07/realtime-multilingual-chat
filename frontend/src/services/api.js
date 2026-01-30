import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateLanguage: (language) => api.put('/auth/language', { preferredLanguage: language })
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  searchUsers: (query) => api.get(`/users/search?query=${query}`),
  getConversations: () => api.get('/users/conversations')
};

// Messages API
export const messagesAPI = {
  getMessages: (userId, limit = 50, skip = 0) => 
    api.get(`/messages/${userId}?limit=${limit}&skip=${skip}`),
  getUnreadCount: () => api.get('/messages/unread/count'),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`)
};

export default api;
