import { apiClient } from '@/services';
import type { AiAlert, AlertStatus, EvidenceAnalysis } from '../types';

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
};
