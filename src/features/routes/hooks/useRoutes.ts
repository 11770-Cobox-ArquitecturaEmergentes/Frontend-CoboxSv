import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routesService } from '../services';
import type { AssignDriverPayload, AssignVehiclePayload, CreateRoutePayload, Route, RouteOrderPayload } from '../types';

const routesQueryKey = ['routes', 'fleet'] as const;

function updateRouteCache(current: Route[] | undefined, updatedRoute: Route) {
  return (current ?? []).map((route) => (route.id === updatedRoute.id ? updatedRoute : route));
}

function useRouteMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<Route>,
  extraInvalidate?: (updatedRoute: Route, variables: TVariables, queryClient: ReturnType<typeof useQueryClient>) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (updatedRoute, variables) => {
      queryClient.setQueryData<Route[]>(routesQueryKey, (current) => updateRouteCache(current, updatedRoute));
      queryClient.setQueryData<Route>(['routes', 'fleet', updatedRoute.id], updatedRoute);
      void queryClient.invalidateQueries({ queryKey: routesQueryKey });
      void queryClient.invalidateQueries({ queryKey: ['routes', 'fleet', updatedRoute.id] });
      extraInvalidate?.(updatedRoute, variables, queryClient);
    },
  });
}

export function useRoutes() {
  return useQuery({
    queryKey: routesQueryKey,
    queryFn: routesService.getRoutes,
  });
}

export function useRoute(routeId?: string) {
  return useQuery({
    queryKey: ['routes', 'fleet', routeId],
    queryFn: () => routesService.getRouteById(routeId as string),
    enabled: Boolean(routeId),
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoutePayload) => routesService.createRoute(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: routesQueryKey });
    },
  });
}

export function useAssignDriverToRoute() {
  return useRouteMutation(
    ({ routeId, payload }: { routeId: string; payload: AssignDriverPayload }) =>
      routesService.assignDriverToRoute(routeId, payload),
    (_updatedRoute, variables, queryClient) => {
      void queryClient.invalidateQueries({ queryKey: ['drivers', variables.payload.driverId, 'routes'] });
      void queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  );
}

export function useAssignVehicleToRoute() {
  return useRouteMutation(
    ({ routeId, payload }: { routeId: string; payload: AssignVehiclePayload }) =>
      routesService.assignVehicleToRoute(routeId, payload),
    (_updatedRoute, variables, queryClient) => {
      void queryClient.invalidateQueries({ queryKey: ['vehicles', 'fleet'] });
      void queryClient.invalidateQueries({ queryKey: ['vehicles', variables.payload.vehicleId] });
    },
  );
}

export function useAddOrderToRoute() {
  return useRouteMutation(
    ({ routeId, payload }: { routeId: string; payload: RouteOrderPayload }) => routesService.addOrderToRoute(routeId, payload),
    (_updatedRoute, _variables, queryClient) => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  );
}

export function useAddDeliveredOrderToRoute() {
  return useRouteMutation(
    ({ routeId, payload }: { routeId: string; payload: RouteOrderPayload }) =>
      routesService.addDeliveredOrderToRoute(routeId, payload),
    (_updatedRoute, _variables, queryClient) => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  );
}

export function useMarkRouteInProgress() {
  return useRouteMutation((routeId: string) => routesService.markRouteInProgress(routeId));
}
