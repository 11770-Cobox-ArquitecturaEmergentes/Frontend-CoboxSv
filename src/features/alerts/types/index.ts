import type { DegradedSection } from '@/types';

export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type BackendAlertResource = {
  id: number;
  alertId: string;
  status: AlertStatus;
  severity: AlertSeverity;
  driverId?: number | null;
  driverName?: string | null;
  routeId?: number | null;
  routeTitle?: string | null;
  vehicleId?: number | null;
  vehiclePlate?: string | null;
  orderId?: number | null;
  orderLabel?: string | null;
  evidenceUrl?: string | null;
  analysisSummary?: string | null;
  createdAt: string;
  acknowledgedAt?: string | null;
  resolvedAt?: string | null;
  linkedIncidentId?: string | null;
};

export type AlertDetailResource = BackendAlertResource & {
  evidenceId?: string | null;
  analysisId?: string | null;
  analysisData?: Record<string, unknown> | null;
  aiConfidence?: number | null;
  incidentType?: string | null;
  acknowledgedBy?: number | null;
  resolvedBy?: number | null;
  resolutionNotes?: string | null;
  linkedIncidentUuid?: string | null;
};

export type Alert = {
  id: number;
  alertId: string;
  status: AlertStatus;
  severity: AlertSeverity;
  driverId?: number | null;
  driverName?: string | null;
  routeId?: number | null;
  routeTitle?: string | null;
  vehicleId?: number | null;
  vehiclePlate?: string | null;
  orderId?: number | null;
  orderLabel?: string | null;
  evidenceUrl?: string | null;
  analysisSummary?: string | null;
  createdAt: string;
  acknowledgedAt?: string | null;
  resolvedAt?: string | null;
  linkedIncidentId?: string | null;
};

export type ResolveAlertPayload = {
  resolutionNotes: string;
};

export type CreateIncidentFromAlertResult = {
  incidentId: string;
  incidentUuid: string;
  created: boolean;
};

export type AlertsSummary = {
  alerts: Alert[];
  degradedSections: DegradedSection[];
};