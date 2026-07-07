import { apiClient } from '@/services';
import type {
  AiAlert,
  AlertStatus,
  AnalysisStatus,
  EvidenceAnalysis,
  ReviewEvidenceAnalysisRequest,
  SmartVisionAnalysisOverview,
} from '../types';

export const smartvisionService = {
  async getAlerts(status?: AlertStatus): Promise<AiAlert[]> {
    const path = status ? `/api/v1/ai-validation/alerts/status/${status}` : '/api/v1/ai-validation/alerts';
    const { data } = await apiClient.get<AiAlert[]>(path);
    return data;
  },

  async getEvidenceAnalysis(clientEvidenceId: string): Promise<EvidenceAnalysis> {
    const { data } = await apiClient.get<EvidenceAnalysis>(
      `/api/v1/ai-validation/evidence-analyses/${clientEvidenceId}`,
    );
    return data;
  },

  async getEvidenceAnalyses(filters: {
    status?: AnalysisStatus | '';
    driverId?: number;
    routeId?: number;
    orderId?: number;
  } = {}): Promise<SmartVisionAnalysisOverview[]> {
    const { data } = await apiClient.get<SmartVisionAnalysisOverview[]>(
      '/api/v1/desktop/smartvision/evidence-analyses',
      {
        params: {
          status: filters.status || undefined,
          driverId: filters.driverId,
          routeId: filters.routeId,
          orderId: filters.orderId,
        },
      },
    );
    return data;
  },

  async reviewEvidenceAnalysis(
    clientEvidenceId: string,
    request: ReviewEvidenceAnalysisRequest,
  ): Promise<EvidenceAnalysis> {
    const { data } = await apiClient.patch<EvidenceAnalysis>(
      `/api/v1/ai-validation/evidence-analyses/${clientEvidenceId}/review`,
      request,
    );
    return data;
  },
};
