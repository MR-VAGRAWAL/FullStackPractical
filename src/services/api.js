import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const events = {
  getAll: () => api.get('/events'),
  create: (eventData) => api.post('/events', eventData),
  register: (eventId) => api.post(`/events/${eventId}/register`),
  cancelRegistration: (eventId, userId) => api.delete(`/events/${eventId}/cancel/${userId}`),
};

export const users = {
  getRegisteredEvents: (userId) => api.get(`/users/${userId}/events`),
};

export default api; 