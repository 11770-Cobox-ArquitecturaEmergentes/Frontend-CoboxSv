import { apiClient } from '@/services';

export const vehiclesService = {
  getVehicles: () => apiClient.get('/vehicles'),
};
