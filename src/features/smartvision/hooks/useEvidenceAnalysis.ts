import { useQuery } from '@tanstack/react-query';
import { smartvisionService } from '../services';

export function useEvidenceAnalysis(clientEvidenceId?: string) {
  return useQuery({
    queryKey: ['smartvision', 'evidence-analysis', clientEvidenceId],
    queryFn: () => smartvisionService.getEvidenceAnalysis(clientEvidenceId as string),
    enabled: Boolean(clientEvidenceId),
    retry: false,
  });
}
