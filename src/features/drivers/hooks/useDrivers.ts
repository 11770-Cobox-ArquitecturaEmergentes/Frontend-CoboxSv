import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { driversService } from '../services';
import type { CreateDriverPayload } from '../types';

export function useDrivers() {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: driversService.getDrivers,
  });
}

export function useDriver(driverId?: string) {
  return useQuery({
    queryKey: ['drivers', driverId],
    queryFn: () => driversService.getDriverById(driverId as string),
    enabled: Boolean(driverId),
  });
}

export function useDriverRoutes(driverId?: string) {
  return useQuery({
    queryKey: ['drivers', driverId, 'routes'],
    queryFn: () => driversService.getRoutesByDriverId(driverId as string),
    enabled: Boolean(driverId),
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDriverPayload) => driversService.createDriver(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
}
