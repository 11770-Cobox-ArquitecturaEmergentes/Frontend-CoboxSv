import { apiClient } from '@/services';

export const authService = {
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
};
