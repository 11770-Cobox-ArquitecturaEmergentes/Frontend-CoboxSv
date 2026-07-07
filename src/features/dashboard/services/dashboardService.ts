import { apiClient } from '@/services';
import type { OperationsDashboard } from '../types';

export const dashboardService = {
  async getOperationsDashboard(): Promise<OperationsDashboard> {
    const { data } = await apiClient.get<OperationsDashboard>('/api/v1/desktop/dashboard/operations');
    return data;
  },
};
