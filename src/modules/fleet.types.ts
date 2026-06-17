export type VehicleStatus = 'operational' | 'maintenance' | 'out_of_service';

export type Vehicle = {
  id: string;
  plate: string;
  type: string;
  capacity: number;
  status: VehicleStatus;
  year: number;
  brand: string;
  model: string;
  lastMaintenance: string;
};

export type CreateVehiclePayload = {
  plate: string;
  capacity: number;
  status: VehicleStatus;
  model: string;
};

export type DriverStatus = 'available' | 'assigned' | 'offline';

export type Driver = {
  id: string;
  name: string;
  license: string;
  status: DriverStatus;
  assignedRoutes: number;
};

export type CreateDriverPayload = {
  name: string;
  license: string;
  status: DriverStatus;
};

export type RouteStatus = 'pending' | 'in_progress' | 'completed';

export type Route = {
  id: string;
  code: string;
  status: RouteStatus;
  vehicleAssigned: string | null;
  driverAssigned: string | null;
  ordersCount: number;
};
