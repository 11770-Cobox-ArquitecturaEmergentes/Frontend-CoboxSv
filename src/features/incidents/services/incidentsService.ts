import { isAxiosError } from "axios";
import { fleetApi } from "@/services";
import type {
  BackendIncidentResource,
  CreateIncidentPayload,
  UpdateIncidentStatusPayload,
  AssignResponsiblePayload,
  Incident,
} from "../types";

/**
 * Mapea la respuesta del backend a nuestro modelo de dominio
 */
function toIncident(backend: BackendIncidentResource): Incident {
  return {
    id: backend.id,
    incidentId: backend.incidentId,
    type: backend.type,
    description: backend.description,
    reportedAt: backend.reportedAt,
    severity: backend.severity,
    status: backend.status,
    responsibleUserId: backend.responsibleUserId,
    sourceType: backend.sourceType,
    sourceAlertId: backend.sourceAlertId,
    sourceClientEvidenceId: backend.sourceClientEvidenceId,
  };
}

export const incidentsService = {
  /**
   * Obtiene todas las incidencias
   */
  async getIncidents(): Promise<Incident[]> {
    const { data } =
      await fleetApi.get<BackendIncidentResource[]>("/api/v1/incidents");
    return (data || []).map(toIncident);
  },

  /**
   * Obtiene una incidencia por su UUID (incidentId del backend)
   */
  async getIncidentById(incidentId: string): Promise<Incident> {
    const { data } = await fleetApi.get<BackendIncidentResource>(
      `/api/v1/incidents/${incidentId}`,
    );
    return toIncident(data);
  },

  /**
   * Crea una nueva incidencia
   */
  async createIncident(payload: CreateIncidentPayload): Promise<Incident> {
    const { data } = await fleetApi.post<BackendIncidentResource>(
      "/api/v1/incidents",
      payload,
    );
    return toIncident(data);
  },

  /**
   * Actualiza el estado de una incidencia
   */
  async updateStatus(
    incidentId: string,
    payload: UpdateIncidentStatusPayload,
  ): Promise<Incident> {
    const { data } = await fleetApi.patch<BackendIncidentResource>(
      `/api/v1/incidents/${incidentId}/status`,
      payload,
    );
    return toIncident(data);
  },

  /**
   * Asigna un responsable a la incidencia
   */
  async assignResponsible(
    incidentId: string,
    payload: AssignResponsiblePayload,
  ): Promise<Incident> {
    const { data } = await fleetApi.patch<BackendIncidentResource>(
      `/api/v1/incidents/${incidentId}/assign`,
      payload,
    );
    return toIncident(data);
  },

  async getBySourceAiAlert(alertId: string): Promise<Incident | null> {
    try {
      const { data } = await fleetApi.get<BackendIncidentResource>(
        `/api/v1/incidents/source/ai-alert/${alertId}`,
      );
      return toIncident(data);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },
};

// Exportar alias para compatibilidad
export const incidentsApi = incidentsService;
