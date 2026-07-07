import type { LucideIcon } from 'lucide-react';

export type KpiColor = 'green' | 'orange' | 'red' | 'default';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
export type AnalysisStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVIEW_REQUIRED'
  | 'RECAPTURE_REQUIRED'
  | 'FRAUD_SUSPECTED'
  | 'DEGRADED';

export type AiAlert = {
  alertId: string;
  clientEvidenceId: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  createdAt: string;
};

export type EvidenceAnalysis = {
  clientEvidenceId: string;
  objectKey: string;
  driverId: number | null;
  orderId: number | null;
  routeId: number | null;
  evidenceType: string | null;
  status: AnalysisStatus;
  provider: string | null;
  confidenceScore: number | null;
  fraudScore: number | null;
  validationSummary: string | null;
  failureReason: string | null;
  createdAt: string;
  completedAt: string | null;
};

export type KpiData = {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  progress?: number;
  color: KpiColor;
};

export type IncidentStatus = 'critical' | 'warning';

export type Incident = {
  id: number;
  type: string;
  driver: string;
  vehicle: string;
  location: string;
  status: IncidentStatus;
  time: string;
  icon: LucideIcon;
};

export type CategoryColor = 'red' | 'orange' | 'yellow';

export type Category = {
  id: string;
  name: string;
  count: number;
  color: CategoryColor;
  icon: LucideIcon;
};

export type DashboardData = {
  kpis: KpiData[];
  alerts: AiAlert[];
  categories: Category[];
};
