import { apiClient } from '@/services';

export const incidentsService = {
  getIncidents: () => apiClient.get('/incidents'),
};
