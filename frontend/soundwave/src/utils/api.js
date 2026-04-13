import axios from 'axios';

const api = axios.create({
    baseURL: "https://sound-wave-backend.vercel.app",
    withCredentials: true // Important if you are using cookies for sessions/JWT
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