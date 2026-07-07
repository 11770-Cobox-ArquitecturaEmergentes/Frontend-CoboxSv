import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { incidentsService } from "../services/incidentsService";
import type {
  Incident,
  CreateIncidentPayload,
  UpdateIncidentStatusPayload,
  AssignResponsiblePayload,
} from "../types";

/**
 * Hook para obtener todas las incidencias
 */
export function useIncidents() {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: () => incidentsService.getIncidents(),
  });
}

/**
 * Hook para obtener una incidencia por su ID (incidentId del backend)
 */
export function useIncidentById(incidentId: string | undefined) {
  return useQuery({
    queryKey: ["incidents", incidentId],
    queryFn: () => incidentsService.getIncidentById(incidentId!),
    enabled: !!incidentId,
  });
}

export function useIncidentBySourceAlert(alertId?: string) {
  return useQuery({
    queryKey: ["incidents", "source", "ai-alert", alertId ?? "none"],
    queryFn: () => incidentsService.getBySourceAiAlert(alertId as string),
    enabled: Boolean(alertId),
  });
}

/**
 * Hook para crear una nueva incidencia
 */
export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIncidentPayload) =>
      incidentsService.createIncident(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

/**
 * Hook para actualizar el estado de una incidencia
 */
export function useUpdateIncidentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      payload,
    }: {
      incidentId: string;
      payload: UpdateIncidentStatusPayload;
    }) => incidentsService.updateStatus(incidentId, payload),
    onSuccess: (updated) => {
      // Actualización optimista
      queryClient.setQueryData<Incident[]>(["incidents"], (current) =>
        (current ?? []).map((incident) =>
          incident.incidentId === updated.incidentId ? updated : incident,
        ),
      );
      void queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

/**
 * Hook para asignar un responsable a una incidencia
 */
export function useAssignResponsible() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      payload,
    }: {
      incidentId: string;
      payload: AssignResponsiblePayload;
    }) => incidentsService.assignResponsible(incidentId, payload),
    onSuccess: (updated) => {
      // Actualización optimista
      queryClient.setQueryData<Incident[]>(["incidents"], (current) =>
        (current ?? []).map((incident) =>
          incident.incidentId === updated.incidentId ? updated : incident,
        ),
      );
      void queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

/**
 * Hook combinado para obtener y actualizar incidencias
 * Útil para componentes que necesitan múltiples operaciones
 */
export function useIncidentsManager() {
  const incidents = useIncidents();
  const createMutation = useCreateIncident();
  const updateStatusMutation = useUpdateIncidentStatus();
  const assignMutation = useAssignResponsible();

  return {
    incidents: incidents.data ?? [],
    isLoading:
      incidents.isLoading ||
      createMutation.isPending ||
      updateStatusMutation.isPending ||
      assignMutation.isPending,
    isError: incidents.isError,
    error: incidents.error,

    // Métodos
    create: createMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    assignResponsible: assignMutation.mutateAsync,
  };
}
