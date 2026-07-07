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
