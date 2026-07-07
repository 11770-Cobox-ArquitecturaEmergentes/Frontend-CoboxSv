import type { AlertStatus } from '../types';
import { useSmartVisionAlerts } from './useSmartVisionAlerts';

/** @deprecated Use useSmartVisionAlerts instead. */
export function useSmartVisionDetections(status?: AlertStatus) {
  return useSmartVisionAlerts(status);
}
