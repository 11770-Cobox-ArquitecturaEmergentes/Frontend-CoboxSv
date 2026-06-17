import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status < 400,
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('cobox_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { /* ignore */ }
  return config;
});
