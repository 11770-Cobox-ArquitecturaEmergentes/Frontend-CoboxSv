import { apiClient } from '@/services';

export const routesService = {
  getRoutes: () => apiClient.get('/routes'),
};
