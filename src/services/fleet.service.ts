import { fleetApi } from './api';
import type {
  CreateDriverPayload,
  CreateVehiclePayload,
  Driver,
  DriverStatus,
  Route,
  Vehicle,
  VehicleStatus,
} from '@/modules/fleet.types';

type ApiEnvelope<T> = { data: T };

function unwrapApiData<T>(payload: T | ApiEnvelope<T>): T {
  if (payload && typeof payload === 'object' && 'data' in payload && Object.keys(payload).length === 1) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

function ensureArray<T>(value: T, resourceName: string): T {
  if (!Array.isArray(value)) {
    throw new Error(`Respuesta invalida para ${resourceName}: se esperaba un arreglo.`);
  }
  return value;
}

function unwrapListResponse<T>(payload: { value?: T[]; Count?: number } | T[]): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && 'value' in payload && Array.isArray(payload.value)) return payload.value;
  throw new Error('Formato de respuesta invalido para lista.');
}

// ── Backend raw shapes ──────────────────────────────────────────

type BackendVehicleResource = {
  id: number;
  plateNumber: string;
  capacityKg: number;
  vehicleStatus: 'OPERATIONAL' | 'ON_ROUTE' | 'IN_MAINTENANCE' | 'OUT_OF_SERVICE';
};

type BackendVehicleListResponse = {
  value: BackendVehicleResource[];
  Count: number;
};

type BackendCreateVehicleRequest = {
  plateNumber: string;
  capacityKg: number;
};

type BackendDriverResource = {
  id: number;
  fullName: string;
  licenseNumber: string;
  driverStatus: 'AVAILABLE' | 'ASSIGNED' | 'OFFLINE';
  assignedRoutes?: number;
};

type BackendDriverListResponse = {
  value: BackendDriverResource[];
  Count: number;
};

type BackendCreateDriverRequest = {
  fullName: string;
  licenseNumber: string;
  driverStatus: string;
};

// ── Mappers ─────────────────────────────────────────────────────

const VEHICLE_STATUS_TO_FRONTEND: Record<string, VehicleStatus> = {
  OPERATIONAL: 'operational',
  ON_ROUTE: 'operational',
  IN_MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service',
};

function toVehicle(backend: BackendVehicleResource): Vehicle {
  return {
    id: String(backend.id),
    plate: backend.plateNumber,
    type: '',
    capacity: backend.capacityKg,
    status: VEHICLE_STATUS_TO_FRONTEND[backend.vehicleStatus] ?? 'operational',
    year: new Date().getFullYear(),
    brand: '',
    model: '',
    lastMaintenance: '',
  };
}

function toCreateVehicleRequest(payload: CreateVehiclePayload): BackendCreateVehicleRequest {
  return { plateNumber: payload.plate, capacityKg: payload.capacity };
}

const DRIVER_STATUS_TO_FRONTEND: Record<string, DriverStatus> = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  OFFLINE: 'offline',
};

const DRIVER_STATUS_TO_BACKEND: Record<DriverStatus, string> = {
  available: 'AVAILABLE',
  assigned: 'ASSIGNED',
  offline: 'OFFLINE',
};

function toDriver(backend: BackendDriverResource): Driver {
  return {
    id: String(backend.id),
    name: backend.fullName,
    license: backend.licenseNumber,
    status: DRIVER_STATUS_TO_FRONTEND[backend.driverStatus] ?? 'offline',
    assignedRoutes: backend.assignedRoutes ?? 0,
  };
}

function toCreateDriverRequest(payload: CreateDriverPayload): BackendCreateDriverRequest {
  return {
    fullName: payload.name,
    licenseNumber: payload.license,
    driverStatus: DRIVER_STATUS_TO_BACKEND[payload.status],
  };
}

// ── Service ─────────────────────────────────────────────────────

export const fleetService = {
  // ── Vehicles ──────────────────────────────────────────────────
  async getVehicles() {
    const response = await fleetApi.get<BackendVehicleListResponse | BackendVehicleResource[]>('/api/v1/vehicles');
    return unwrapListResponse(response.data).map(toVehicle);
  },

  async getVehicleById(vehicleId: string) {
    const { data } = await fleetApi.get<BackendVehicleResource>(`/api/v1/vehicles/${vehicleId}`);
    return toVehicle(data);
  },

  async createVehicle(payload: CreateVehiclePayload) {
    const { data } = await fleetApi.post<BackendVehicleResource>('/api/v1/vehicles', toCreateVehicleRequest(payload));
    return toVehicle(data);
  },

  // ── Drivers ───────────────────────────────────────────────────
  async getDrivers() {
    const response = await fleetApi.get<BackendDriverListResponse | BackendDriverResource[]>('/api/v1/drivers');
    return unwrapListResponse(response.data).map(toDriver);
  },

  async getDriverById(driverId: string) {
    const { data } = await fleetApi.get<BackendDriverResource>(`/api/v1/drivers/${driverId}`);
    return toDriver(data);
  },

  async createDriver(payload: CreateDriverPayload) {
    const { data } = await fleetApi.post<BackendDriverResource>('/api/v1/drivers', toCreateDriverRequest(payload));
    return toDriver(data);
  },

  // ── Routes ────────────────────────────────────────────────────
  async getRoutes() {
    const response = await fleetApi.get<Route[] | ApiEnvelope<Route[]>>('/api/v1/routes');
    return ensureArray(unwrapApiData<Route[]>(response.data), 'rutas');
  },

  async getRouteById(routeId: string) {
    const response = await fleetApi.get<Route | ApiEnvelope<Route>>(`/api/v1/routes/${routeId}`);
    return unwrapApiData<Route>(response.data);
  },

  async assignVehicleToRoute(routeId: string, vehicleId: string) {
    const response = await fleetApi.patch<Route | ApiEnvelope<Route>>(`/api/v1/routes/${routeId}/vehicle`, { vehicleId });
    return unwrapApiData<Route>(response.data);
  },

  async assignDriverToRoute(routeId: string, driverId: string) {
    const response = await fleetApi.patch<Route | ApiEnvelope<Route>>(`/api/v1/routes/${routeId}/driver`, { driverId });
    return unwrapApiData<Route>(response.data);
  },

  async markRouteInProgress(routeId: string) {
    const response = await fleetApi.patch<Route | ApiEnvelope<Route>>(`/api/v1/routes/${routeId}/in-progress`);
    return unwrapApiData<Route>(response.data);
  },
};
