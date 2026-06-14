import { apiClient } from '@/services';

export const ordersService = {
  getOrders: () => apiClient.get('/orders'),
};
