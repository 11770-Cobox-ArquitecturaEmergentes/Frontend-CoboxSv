import { apiClient } from '@/services';

export const reportsService = {
  getReports: () => apiClient.get('/reports'),
};
