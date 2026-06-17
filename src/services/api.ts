import axios from 'axios';

export const fleetApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status < 400,
});

fleetApi.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('cobox_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { /* ignore */ }
  return config;
});
