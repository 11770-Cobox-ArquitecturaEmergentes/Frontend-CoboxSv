import { fleetApi } from '@/services';
import type {
  Alert,
  AlertDetailResource,
  AlertStatus,
  AlertsSummary,
  BackendAlertResource,
  CreateIncidentFromAlertResult,
  ResolveAlertPayload,
} from '../types';
import type { DegradedSection } from '@/types';

function toAlert(backend: BackendAlertResource): Alert {
  return {
    id: backend.id,
    alertId: backend.alertId,
    status: backend.status,
    severity: backend.severity,
    driverId: backend.driverId ?? null,
    driverName: backend.driverName ?? null,
    routeId: backend.routeId ?? null,
    routeTitle: backend.routeTitle ?? null,
    vehicleId: backend.vehicleId ?? null,
    vehiclePlate: backend.vehiclePlate ?? null,
    orderId: backend.orderId ?? null,
    orderLabel: backend.orderLabel ?? null,
    evidenceUrl: backend.evidenceUrl ?? null,
    analysisSummary: backend.analysisSummary ?? null,
    createdAt: backend.createdAt,
    acknowledgedAt: backend.acknowledgedAt ?? null,
    resolvedAt: backend.resolvedAt ?? null,
    linkedIncidentId: backend.linkedIncidentId ?? null,
  };
}

type EnvelopeLike<T> = {
  value?: T[];
  data?: T[];
  alerts?: T[];
  degradedSections?: DegradedSection[];
};

function ensureArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const env = data as EnvelopeLike<T>;
    if (Array.isArray(env.value)) return env.value;
    if (Array.isArray(env.data)) return env.data;
    if (Array.isArray(env.alerts)) return env.alerts;
  }
  return [];
}

function extractDegradedSections(data: unknown): DegradedSection[] {
  if (data && typeof data === 'object') {
    const env = data as EnvelopeLike<unknown>;
    if (Array.isArray(env.degradedSections)) return env.degradedSections;
  }
  return [];
}

export const alertsService = {
  async getAlerts(status?: AlertStatus): Promise<AlertsSummary> {
    const { data } = await fleetApi.get<unknown>(
      '/api/v1/desktop/smartvision/alerts',
      { params: status ? { status } : undefined },
    );
    const alerts = ensureArray<BackendAlertResource>(data).map(toAlert);
    const degradedSections = extractDegradedSections(data);
    return { alerts, degradedSections };
  },

  async getAlertDetail(alertId: string): Promise<AlertDetailResource> {
    const { data } = await fleetApi.get<AlertDetailResource>(
      `/api/v1/ai-validation/alerts/${alertId}`,
    );
    return data;
  },

  async acknowledgeAlert(alertId: string): Promise<BackendAlertResource> {
    const { data } = await fleetApi.patch<BackendAlertResource>(
      `/api/v1/ai-validation/alerts/${alertId}/acknowledge`,
    );
    return data;
  },

  async resolveAlert(
    alertId: string,
    payload: ResolveAlertPayload,
  ): Promise<BackendAlertResource> {
    const { data } = await fleetApi.patch<BackendAlertResource>(
      `/api/v1/ai-validation/alerts/${alertId}/resolve`,
      { resolutionNotes: payload.resolutionNotes },
    );
    return data;
  },

  async createIncidentFromAlert(
    alertId: string,
  ): Promise<CreateIncidentFromAlertResult> {
    const response = await fleetApi.post<Record<string, unknown>>(
      `/api/v1/ai-validation/alerts/${alertId}/incident`,
    );
    const resource = (response.data ?? {}) as Record<string, unknown>;
    const incidentId = String(resource.id ?? resource.incidentId ?? '');
    const incidentUuid = String(resource.incidentId ?? resource.incidentUuid ?? incidentId);
    const created =
      resource.created === true ||
      resource.alreadyExists === false ||
      response.status === 201;
    return { incidentId, incidentUuid, created };
  },
};

