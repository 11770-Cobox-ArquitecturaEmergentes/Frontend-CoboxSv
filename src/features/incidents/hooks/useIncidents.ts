import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { incidentsService } from '../services/incidentsService';
import type { CreateIncidentPayload, ResolveIncidentPayload, Incident, IncidentStatus } from '../types';

export function useIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: () => incidentsService.getIncidents(),
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIncidentPayload) => incidentsService.createIncident(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useUpdateIncidentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: IncidentStatus; note?: string }) =>
      incidentsService.updateStatus(id, status, note),
    onSuccess: (updated) => {
      queryClient.setQueryData<Incident[]>(['incidents'], (current) =>
        (current ?? []).map((inc) => (inc.id === updated.id ? updated : inc)),
      );
      void queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useResolveIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ResolveIncidentPayload }) =>
      incidentsService.resolveIncident(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<Incident[]>(['incidents'], (current) =>
        (current ?? []).map((inc) => (inc.id === updated.id ? updated : inc)),
      );
      void queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useAssociateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, evidenceId }: { id: string; evidenceId: string }) =>
      incidentsService.associateEvidence(id, evidenceId),
    onSuccess: (updated) => {
      queryClient.setQueryData<Incident[]>(['incidents'], (current) =>
        (current ?? []).map((inc) => (inc.id === updated.id ? updated : inc)),
      );
      void queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}
