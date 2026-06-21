import type { VehicleStatus } from '@/modules/fleet.types';

export type VehicleStatusLog = {
  status: VehicleStatus;
  changedAt: string;
  reason: string;
};
