import { apiClient } from '@/services';
import type { OperationsDashboard, RouteOverview, VehicleHealth } from '../types';

export const dashboardService = {
  async getOperationsDashboard(): Promise<OperationsDashboard> {
    const { data } = await apiClient.get<OperationsDashboard>('/api/v1/desktop/dashboard/operations');
    return data;
  },
  async getRouteOverview(routeId: number): Promise<RouteOverview> {
    const { data } = await apiClient.get<RouteOverview>(`/api/v1/desktop/routes/${routeId}/overview`);
    return data;
  },
  async getVehicleHealth(vehicleId: number): Promise<VehicleHealth> {
    const { data } = await apiClient.get<VehicleHealth>(`/api/v1/desktop/vehicles/${vehicleId}/health`);
    return data;
  },
};
