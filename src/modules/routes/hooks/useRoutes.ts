import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fleetService } from '@/services';
import type { Route } from '@/modules/fleet.types';

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: fleetService.getRoutes,
  });
}

export function useAssignVehicleToRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, vehicleId }: { routeId: string; vehicleId: string }) =>
      fleetService.assignVehicleToRoute(routeId, vehicleId),
    onSuccess: (updatedRoute) => {
      queryClient.setQueryData<Route[]>(['routes'], (current) =>
        (current ?? []).map((route) => (route.id === updatedRoute.id ? updatedRoute : route)),
      );
      void queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

export function useAssignDriverToRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, driverId }: { routeId: string; driverId: string }) =>
      fleetService.assignDriverToRoute(routeId, driverId),
    onSuccess: (updatedRoute) => {
      queryClient.setQueryData<Route[]>(['routes'], (current) =>
        (current ?? []).map((route) => (route.id === updatedRoute.id ? updatedRoute : route)),
      );
      void queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

export function useMarkRouteInProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) => fleetService.markRouteInProgress(routeId),
    onSuccess: (updatedRoute) => {
      queryClient.setQueryData<Route[]>(['routes'], (current) =>
        (current ?? []).map((route) => (route.id === updatedRoute.id ? updatedRoute : route)),
      );
      void queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
