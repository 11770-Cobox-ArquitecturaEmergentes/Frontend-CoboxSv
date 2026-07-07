import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vehiclesService } from '../services';
import type { CreateVehiclePayload, UpdateVehicleStatusPayload, Vehicle } from '../types';

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles', 'fleet'],
    queryFn: vehiclesService.getVehicles,
  });
}

export function useVehicle(vehicleId?: string) {
  return useQuery({
    queryKey: ['vehicles', vehicleId],
    queryFn: () => vehiclesService.getVehicleById(vehicleId as string),
    enabled: Boolean(vehicleId),
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => vehiclesService.createVehicle(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vehicles', 'fleet'] });
    },
  });
}

export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, payload }: { vehicleId: string; payload: UpdateVehicleStatusPayload }) =>
      vehiclesService.updateVehicleStatus(vehicleId, payload),
    onSuccess: (vehicle: Vehicle) => {
      queryClient.setQueryData<Vehicle[]>(['vehicles', 'fleet'], (current) =>
        (current ?? []).map((item) => (item.id === vehicle.id ? vehicle : item)),
      );
      queryClient.setQueryData<Vehicle>(['vehicles', vehicle.id], vehicle);
      void queryClient.invalidateQueries({ queryKey: ['vehicles', 'fleet'] });
      void queryClient.invalidateQueries({ queryKey: ['vehicles', vehicle.id] });
    },
  });
}
