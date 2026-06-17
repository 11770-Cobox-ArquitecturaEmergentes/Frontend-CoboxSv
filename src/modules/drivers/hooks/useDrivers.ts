import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fleetService } from '@/services';
import type { CreateDriverPayload } from '@/modules/fleet.types';

export function useDrivers() {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: fleetService.getDrivers,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDriverPayload) => fleetService.createDriver(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
}
