import { useQuery } from '@tanstack/react-query';
import { smartvisionService } from '../services';
import type { AlertStatus } from '../types';

export function useSmartVisionAlerts(status?: AlertStatus) {
  return useQuery({
    queryKey: ['smartvision', 'alerts', status ?? 'all'],
    queryFn: () => smartvisionService.getAlerts(status),
  });
}
