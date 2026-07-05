/** Backend Response Types - Mapeo directo desde API */

export type MaintenanceType = "PREVENTIVE" | "CORRECTIVE" | "PREDICTIVE";
export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type MaintenanceReason =
  | "SCHEDULED"
  | "BREAKDOWN"
  | "INSPECTION"
  | "OTHER";
export type MaintenanceOrderStatus =
  | "OPEN"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type PartsRequestStatus = "REQUESTED" | "RECEIVED";
export type MaintenanceScheduleStatus = "ACTIVE" | "INACTIVE";

/** Nested Types */

export type Job = {
  id: number;
  description: string;
  completed: boolean;
};

export type PartsRequest = {
  id: number;
  partName: string;
  quantity: number;
  status: PartsRequestStatus;
};

export type MaintenanceRule = {
  name: string;
  thresholdKm: number;
  thresholdDays: number;
};

/** Backend Response Resources */

export type BackendMaintenanceOrderResource = {
  id: number;
  vehicleId: number;
  maintenanceType: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceOrderStatus;
  reason: MaintenanceReason;
  openingOdometer: number;
  closingOdometer?: number;
  scheduledTimelapseDays: number;
  jobs: Job[];
  partsRequests: PartsRequest[];
  totalCostAmount: string;
  totalCostCurrency: string;
  technicianId?: number;
};

export type BackendMaintenanceScheduleResource = {
  id: number;
  vehicleId: number;
  status: MaintenanceScheduleStatus;
  rules: MaintenanceRule[];
  lastEvaluationAt?: string;
  nextEvaluationAt?: string;
};

/** Frontend Domain Models */

export type MaintenanceOrder = BackendMaintenanceOrderResource;
export type MaintenanceSchedule = BackendMaintenanceScheduleResource;

/** Request Payloads */

export type CreateMaintenanceOrderPayload = {
  vehicleId: number;
  maintenanceType: MaintenanceType;
  priority: MaintenancePriority;
  reason: MaintenanceReason;
  openingOdometer: number;
  scheduledTimelapseDays: number;
  technicianId?: number;
};

export type ScheduleMaintenanceOrderPayload = {
  scheduledTimelapseDays: number;
};

export type StartMaintenanceOrderPayload = Record<string, never>;

export type CompleteMaintenanceOrderPayload = {
  closingOdometer: number;
};

export type CancelMaintenanceOrderPayload = {
  reason: string;
};

export type RegisterJobPayload = {
  description: string;
  completed?: boolean;
};

export type RequestPartsPayload = {
  partName: string;
  quantity: number;
};

export type ReceivePartsPayload = {
  partsRequestId: number;
};

export type RegisterCostPayload = {
  amount: number;
  currency: string;
};

export type CreateMaintenanceSchedulePayload = {
  vehicleId: number;
  rules: MaintenanceRule[];
};

export type UpdateMaintenanceRulesPayload = {
  rules: MaintenanceRule[];
};

/** Legacy Types - Kept for compatibility */
export type VehicleStatusLog = {
  status: string;
  changedAt: string;
  reason: string;
};
