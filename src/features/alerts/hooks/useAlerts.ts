import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { alertsService } from '../services/alertsService';
import type { AlertStatus, ResolveAlertPayload } from '../types';

export function useAlerts(status?: AlertStatus) {
  return useQuery({
    queryKey: ['alerts', status ?? 'all'],
    queryFn: () => alertsService.getAlerts(status),
  });
}

export function useAlertDetail(alertId?: string) {
  return useQuery({
    queryKey: ['alerts', 'detail', alertId],
    queryFn: () => alertsService.getAlertDetail(alertId as string),
    enabled: Boolean(alertId),
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => alertsService.acknowledgeAlert(alertId),
    onSuccess: (_data, alertId) => {
      void queryClient.invalidateQueries({ queryKey: ['alerts'] });
      void queryClient.invalidateQueries({
        queryKey: ['alerts', 'detail', alertId],
      });
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertId,
      payload,
    }: {
      alertId: string;
      payload: ResolveAlertPayload;
    }) => alertsService.resolveAlert(alertId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['alerts'] });
      void queryClient.invalidateQueries({
        queryKey: ['alerts', 'detail', variables.alertId],
      });
    },
  });
}

export function useCreateIncidentFromAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => alertsService.createIncidentFromAlert(alertId),
    onSuccess: (_data, alertId) => {
      void queryClient.invalidateQueries({ queryKey: ['alerts'] });
      void queryClient.invalidateQueries({
        queryKey: ['alerts', 'detail', alertId],
      });
    },
  });
}