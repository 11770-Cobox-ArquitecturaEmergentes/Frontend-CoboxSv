import { apiClient } from '@/services';

export const settingsService = {
  getSettings: () => apiClient.get('/settings'),
};
