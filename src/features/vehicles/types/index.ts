import type { DegradedSection } from '@/types';

export type VehicleStatus = 'OPERATIONAL' | 'ON_ROUTE' | 'IN_MAINTENANCE' | 'OUT_OF_SERVICE';

export type BackendVehicleResource = {
  id: number;
  plateNumber?: string;
  capacityKg?: number;
  vehicleStatus?: VehicleStatus;
  plate?: string;
  capacity?: number;
  status?: VehicleStatus | 'operational' | 'maintenance' | 'out_of_service';
};

export type Vehicle = {
  id: string;
  plateNumber: string;
  capacityKg: number;
  status: VehicleStatus;
};

export type CreateVehiclePayload = {
  plateNumber: string;
  capacityKg: number;
};

export type UpdateVehicleStatusPayload = {
  vehicleStatus: Exclude<VehicleStatus, 'ON_ROUTE'>;
};

export type VehicleHealthScheduleSummary = {
  id: number;
  vehicleId: number;
  status?: string | null;
  lastEvaluationAt?: string | null;
  nextEvaluationAt?: string | null;
  rules?: { id?: number; name?: string; thresholdKm?: number; thresholdDays?: number }[];
};

export type VehicleHealthOrderSummary = {
  id: number;
  vehicleId: number | null;
  maintenanceType: string | null;
  priority: string | null;
  status: string | null;
  openingOdometer: number | null;
  closingOdometer: number | null;
  totalCostAmount: number | null;
  totalCostCurrency: string | null;
  technicianId: number | null;
};

export type VehicleHealthResource = {
  generatedAt: string;
  vehicle: {
    id: number;
    plateNumber: string | null;
    capacityKg: number | null;
    status: string | null;
  };
  openMaintenanceOrders: VehicleHealthOrderSummary[];
  maintenanceHistory: VehicleHealthOrderSummary[];
  maintenanceSchedule?: VehicleHealthScheduleSummary[] | null;
  degradedSections: DegradedSection[];
};
