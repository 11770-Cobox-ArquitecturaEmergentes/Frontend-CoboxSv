import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '../services/maintenanceService';
import type { VehicleStatus } from '@/modules/fleet.types';

export function useMaintenanceVehicles() {
  return useQuery({
    queryKey: ['maintenance-vehicles'],
    queryFn: () => maintenanceService.getVehiclesInMaintenance(),
  });
}

export function useVehicleStatusHistory(vehicleId: string | undefined) {
  return useQuery({
    queryKey: ['vehicle-status-history', vehicleId],
    queryFn: () => {
      if (!vehicleId) return Promise.resolve([]);
      return maintenanceService.getVehicleStatusHistory(vehicleId);
    },
    enabled: Boolean(vehicleId),
  });
}

export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      status,
      reason,
    }: {
      vehicleId: string;
      status: VehicleStatus;
      reason: string;
    }) => maintenanceService.updateVehicleStatus(vehicleId, status, reason),
    onSuccess: (updatedVehicle) => {
      // Invalidate queries to reload all vehicle lists
      void queryClient.invalidateQueries({ queryKey: ['maintenance-vehicles'] });
      void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      void queryClient.invalidateQueries({ queryKey: ['vehicle-status-history', updatedVehicle.id] });
    },
  });
}
