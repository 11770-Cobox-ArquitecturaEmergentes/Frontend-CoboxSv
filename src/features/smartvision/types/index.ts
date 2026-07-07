import type { LucideIcon } from 'lucide-react';

export type KpiColor = 'green' | 'orange' | 'red' | 'default';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
export type EvidenceReviewStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
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
  acknowledgedAt?: string | null;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  linkedIncidentId?: string | number | null;
};

export type EvidenceAnalysis = {
  clientEvidenceId: string;
  objectKey: string;
  driverId: number | null;
  orderId: number | null;
  routeId: number | null;
  evidenceType: string | null;
  sourceType: string | null;
  sourceId: string | null;
  status: AnalysisStatus;
  provider: string | null;
  confidenceScore: number | null;
  fraudScore: number | null;
  validationSummary: string | null;
  failureReason: string | null;
  reviewStatus: EvidenceReviewStatus | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  previewUrl: string | null;
  createdAt: string;
  completedAt: string | null;
};

export type DegradedSection = {
  section: string;
  reason: string;
};

export type DriverSummary = {
  id: number;
  email: string | null;
  licenceNumber: string | null;
  status: string | null;
};

export type RouteSummary = {
  id: number;
  title: string | null;
  vehicleId: number | null;
  driverId: number | null;
  orderIds: number[];
  finishedOrderIds: number[];
  status: string | null;
};

export type VehicleSummary = {
  id: number;
  plateNumber: string | null;
  capacityKg: number | null;
  status: string | null;
};

export type OrderSummary = {
  id: number;
  clientId: number | null;
  city: string | null;
  country: string | null;
  weightKg: number | null;
  status: string | null;
};

export type SmartVisionAnalysisOverview = {
  analysis: EvidenceAnalysis;
  alerts: AiAlert[];
  driver: DriverSummary | null;
  route: RouteSummary | null;
  vehicle: VehicleSummary | null;
  order: OrderSummary | null;
  degradedSections: DegradedSection[];
};

export type ReviewEvidenceAnalysisRequest = {
  reviewStatus: Exclude<EvidenceReviewStatus, 'PENDING'>;
  notes?: string;
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
