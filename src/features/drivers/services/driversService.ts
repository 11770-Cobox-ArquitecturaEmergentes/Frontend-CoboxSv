import { apiClient } from '@/services';

export const driversService = {
  getDrivers: () => apiClient.get('/drivers'),
};
