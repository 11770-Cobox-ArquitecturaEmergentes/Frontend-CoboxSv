import { useQuery } from '@tanstack/react-query';
import { evidenceAnalysesService } from '../services/evidenceAnalysesService';
import type { EvidenceAnalysisFilters } from '../types';

export function useEvidenceAnalyses(filters: EvidenceAnalysisFilters = {}) {
  return useQuery({
    queryKey: [
      'evidence-analyses',
      filters.status ?? 'all',
      filters.driverId ?? 'all',
      filters.routeId ?? 'all',
      filters.orderId ?? 'all',
    ],
    queryFn: () => evidenceAnalysesService.getEvidenceAnalyses(filters),
  });
}