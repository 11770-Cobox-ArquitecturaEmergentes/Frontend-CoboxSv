import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services';

export function useRouteOverview(routeId?: number) {
  return useQuery({
    queryKey: ['dashboard', 'route-overview', routeId],
    queryFn: () => dashboardService.getRouteOverview(routeId as number),
    enabled: Boolean(routeId),
  });
}
