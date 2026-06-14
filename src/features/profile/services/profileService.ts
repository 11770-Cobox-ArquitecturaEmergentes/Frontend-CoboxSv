import { apiClient } from '@/services';

export const profileService = {
  getProfile: () => apiClient.get('/profile'),
};
