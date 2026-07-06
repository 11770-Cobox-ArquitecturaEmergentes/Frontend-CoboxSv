import axios from 'axios';
import { getAccessToken } from '@/lib';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status < 400,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
