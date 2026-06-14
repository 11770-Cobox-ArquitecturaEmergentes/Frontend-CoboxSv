import { apiClient } from '@/services';

export const maintenanceService = {
  getMaintenanceEvents: () => apiClient.get('/maintenance'),
};
