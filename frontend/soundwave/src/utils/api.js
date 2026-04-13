import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// Auth routes
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Music routes
export const uploadMusic = (formData) =>
  api.post('/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Album routes
export const createAlbum = (data) => api.post('/album/album', data);

export default api;