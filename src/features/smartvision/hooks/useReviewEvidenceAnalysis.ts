import { useMutation, useQueryClient } from '@tanstack/react-query';
import { smartvisionService } from '../services';
import type { ReviewEvidenceAnalysisRequest } from '../types';

export function useReviewEvidenceAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      clientEvidenceId,
      request,
    }: {
      clientEvidenceId: string;
      request: ReviewEvidenceAnalysisRequest;
    }) => smartvisionService.reviewEvidenceAnalysis(clientEvidenceId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['smartvision'] });
    },
  });
}
