import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';
import type { UpdateSettingsPayload } from '../types';

export function useSettings() {
  return useQuery({
    queryKey: ['settings', 'me'],
    queryFn: () => settingsService.getSettings(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => settingsService.updateSettings(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings', 'me'] });
    },
  });
}