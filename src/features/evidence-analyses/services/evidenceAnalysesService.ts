import { fleetApi } from '@/services';
import type { DegradedSection } from '@/types';
import type {
  BackendEvidenceAnalysisResource,
  EvidenceAnalysis,
  EvidenceAnalysisFilters,
  EvidenceAnalysesSummary,
} from '../types';

function toEvidenceAnalysis(backend: BackendEvidenceAnalysisResource): EvidenceAnalysis {
  return {
    id: backend.id,
    analysisId: backend.analysisId,
    status: backend.status,
    driverId: backend.driverId ?? null,
    driverName: backend.driverName ?? null,
    routeId: backend.routeId ?? null,
    routeTitle: backend.routeTitle ?? null,
    vehicleId: backend.vehicleId ?? null,
    vehiclePlate: backend.vehiclePlate ?? null,
    orderId: backend.orderId ?? null,
    orderLabel: backend.orderLabel ?? null,
    evidenceUrl: backend.evidenceUrl ?? null,
    thumbnailUrl: backend.thumbnailUrl ?? null,
    aiSummary: backend.aiSummary ?? null,
    aiConfidence: backend.aiConfidence ?? null,
    analysisData: backend.analysisData ?? null,
    detectedLabels: backend.detectedLabels ?? null,
    createdAt: backend.createdAt,
    processedAt: backend.processedAt ?? null,
  };
}

type EnvelopeLike<T> = {
  value?: T[];
  data?: T[];
  analyses?: T[];
  degradedSections?: DegradedSection[];
};

function ensureArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const env = data as EnvelopeLike<T>;
    if (Array.isArray(env.analyses)) return env.analyses;
    if (Array.isArray(env.value)) return env.value;
    if (Array.isArray(env.data)) return env.data;
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

export const evidenceAnalysesService = {
  async getEvidenceAnalyses(filters: EvidenceAnalysisFilters = {}): Promise<EvidenceAnalysesSummary> {
    const params: Record<string, string | number> = {};
    if (filters.status) params.status = filters.status;
    if (filters.driverId) params.driverId = filters.driverId;
    if (filters.routeId) params.routeId = filters.routeId;
    if (filters.orderId) params.orderId = filters.orderId;

    const { data } = await fleetApi.get<unknown>(
      '/api/v1/desktop/smartvision/evidence-analyses',
      { params },
    );
    const analyses = ensureArray<BackendEvidenceAnalysisResource>(data).map(toEvidenceAnalysis);
    const degradedSections = extractDegradedSections(data);
    return { analyses, degradedSections };
  },
};