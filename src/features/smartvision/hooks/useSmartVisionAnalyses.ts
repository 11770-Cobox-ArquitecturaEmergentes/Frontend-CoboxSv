import { useQuery } from '@tanstack/react-query';
import { smartvisionService } from '../services';
import type { AnalysisStatus } from '../types';

export function useSmartVisionAnalyses(status?: AnalysisStatus | '') {
  return useQuery({
    queryKey: ['smartvision', 'evidence-analyses', status ?? 'all'],
    queryFn: () => smartvisionService.getEvidenceAnalyses({ status }),
  });
}
