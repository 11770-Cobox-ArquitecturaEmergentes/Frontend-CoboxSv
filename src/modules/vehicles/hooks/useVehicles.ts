import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fleetService } from '@/services';
import type { CreateVehiclePayload } from '@/modules/fleet.types';

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: fleetService.getVehicles,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => fleetService.createVehicle(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}
