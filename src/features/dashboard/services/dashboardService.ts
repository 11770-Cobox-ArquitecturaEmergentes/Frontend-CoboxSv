import { apiClient } from '@/services';

export const dashboardService = {
  getSummary: () => apiClient.get('/dashboard/summary'),
};
