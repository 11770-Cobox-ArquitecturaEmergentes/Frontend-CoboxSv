import type { DegradedSection } from '@/types';

export type EvidenceAnalysisStatus = 'PENDING' | 'PROCESSED' | 'FLAGGED' | 'REJECTED';

export type BackendEvidenceAnalysisResource = {
  id: number;
  analysisId: string;
  status: EvidenceAnalysisStatus;
  driverId?: number | null;
  driverName?: string | null;
  routeId?: number | null;
  routeTitle?: string | null;
  vehicleId?: number | null;
  vehiclePlate?: string | null;
  orderId?: number | null;
  orderLabel?: string | null;
  evidenceUrl?: string | null;
  thumbnailUrl?: string | null;
  aiSummary?: string | null;
  aiConfidence?: number | null;
  analysisData?: Record<string, unknown> | null;
  detectedLabels?: string[] | null;
  createdAt: string;
  processedAt?: string | null;
};

export type EvidenceAnalysis = {
  id: number;
  analysisId: string;
  status: EvidenceAnalysisStatus;
  driverId?: number | null;
  driverName?: string | null;
  routeId?: number | null;
  routeTitle?: string | null;
  vehicleId?: number | null;
  vehiclePlate?: string | null;
  orderId?: number | null;
  orderLabel?: string | null;
  evidenceUrl?: string | null;
  thumbnailUrl?: string | null;
  aiSummary?: string | null;
  aiConfidence?: number | null;
  analysisData?: Record<string, unknown> | null;
  detectedLabels?: string[] | null;
  createdAt: string;
  processedAt?: string | null;
};

export type EvidenceAnalysesSummary = {
  analyses: EvidenceAnalysis[];
  degradedSections: DegradedSection[];
};

export type EvidenceAnalysisFilters = {
  status?: EvidenceAnalysisStatus;
  driverId?: number;
  routeId?: number;
  orderId?: number;
};