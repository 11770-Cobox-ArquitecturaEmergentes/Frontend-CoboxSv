import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services';

export function useVehicleHealth(vehicleId?: number) {
  return useQuery({
    queryKey: ['dashboard', 'vehicle-health', vehicleId],
    queryFn: () => dashboardService.getVehicleHealth(vehicleId as number),
    enabled: Boolean(vehicleId),
  });
}
