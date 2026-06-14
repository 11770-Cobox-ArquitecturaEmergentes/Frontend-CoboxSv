import { apiClient } from '@/services';

export const smartvisionService = {
  getDetections: () => apiClient.get('/smartvision/detections'),
};
