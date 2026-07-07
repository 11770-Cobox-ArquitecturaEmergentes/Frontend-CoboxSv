/** Backend Response Types - Mapeo directo desde API */

export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export type BackendIncidentResource = {
  id: number;
  incidentId: string; // UUID
  type: string;
  description: string;
  reportedAt: string; // ISO datetime
  severity: IncidentSeverity;
  status: IncidentStatus;
  responsibleUserId?: number;
  sourceType?: 'AI_ALERT' | 'MANUAL' | null;
  sourceAlertId?: string | null;
  sourceClientEvidenceId?: string | null;
};

/** Frontend Domain Model */

export type Incident = {
  id: number; // Backend ID (no usamos incidentId como PK)
  incidentId: string; // UUID del backend
  type: string;
  description: string;
  reportedAt: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  responsibleUserId?: number;
  sourceType?: 'AI_ALERT' | 'MANUAL' | null;
  sourceAlertId?: string | null;
  sourceClientEvidenceId?: string | null;
};

/** Request Payloads */

export type CreateIncidentPayload = {
  type: string;
  description: string;
  severity: IncidentSeverity;
  responsibleUserId: number;
};

export type UpdateIncidentStatusPayload = {
  status: IncidentStatus;
};

export type AssignResponsiblePayload = {
  responsibleUserId: number;
};
