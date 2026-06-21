export type IncidentType = 'ACCIDENT' | 'BREAKDOWN' | 'ROAD_BLOCK' | 'DELIVERY_ISSUE' | 'OTHER';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type IncidentStatus = 'REPORTED' | 'IN_REVIEW' | 'RESOLVED';

export type IncidentResolution = {
  type: string;
  summary: string;
  responsible: string;
  closedAt: string;
};

export type IncidentStatusLog = {
  status: IncidentStatus;
  changedAt: string;
  note?: string;
};

export type Incident = {
  id: string;
  serviceReference: string; // ID de la orden relacionada
  reporterReference: string; // Nombre/ID del conductor reportero
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  location: string;
  evidenceReferences: string[];
  statusHistory: IncidentStatusLog[];
  resolution?: IncidentResolution;
  createdAt: string;
};

export type CreateIncidentPayload = {
  serviceReference: string;
  reporterReference: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
};

export type ResolveIncidentPayload = {
  type: string;
  summary: string;
  responsible: string;
};
