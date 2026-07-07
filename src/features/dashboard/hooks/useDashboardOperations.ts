import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services';

export function useDashboardOperations() {
  return useQuery({
    queryKey: ['dashboard', 'operations'],
    queryFn: dashboardService.getOperationsDashboard,
  });
}
