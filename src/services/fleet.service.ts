import { fleetApi } from './api';
import type {
  CreateDriverPayload,
  CreateVehiclePayload,
  Driver,
  DriverStatus,
  Route,
  RouteStatus,
  Vehicle,
  VehicleStatus,
} from '@/modules/fleet.types';

function ensureArray<T>(value: any, resourceName: string): T[] {
  if (!Array.isArray(value)) {
    if (value && typeof value === 'object' && 'value' in value && Array.isArray(value.value)) {
      return value.value;
    }
    if (value && typeof value === 'object' && 'data' in value && Array.isArray(value.data)) {
      return value.data;
    }
    throw new Error(`Respuesta invalida para ${resourceName}: se esperaba un arreglo.`);
  }
  return value;
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
  driverStatus: 'AVAILABLE' | 'ASSIGNED' | 'OFFLINE' | 'ON_ROUTE' | 'ON_BREAK' | 'UNAVAILABLE';
  assignedRoutes?: number;
};

type BackendCreateDriverRequest = {
  fullName: string;
  licenseNumber: string;
  driverStatus: string;
};

type BackendRouteResource = {
  id: number;
  title: string;
  vehicleId: number | null;
  driverId: number | null;
  ordersIds: { orderId: number }[];
  finishedOrderIds: { orderId: number }[];
  routeStatus: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
};

// ── Local Storage History (fallback mientras el backend no exponga historial) ──

const VEHICLE_STATUS_HISTORY_KEY = 'cobox_vehicle_status_history';

export type VehicleStatusLog = {
  status: VehicleStatus;
  changedAt: string;
  reason: string;
};

export function getVehicleStatusHistoryLocal(vehicleId: string): VehicleStatusLog[] {
  try {
    const history = localStorage.getItem(VEHICLE_STATUS_HISTORY_KEY);
    const parsed = history ? JSON.parse(history) : {};
    const list = parsed[vehicleId] || [];
    if (list.length === 0) {
      // Default initial log
      return [
        {
          status: 'operational',
          changedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          reason: 'Unidad de transporte dada de alta en el sistema de flotas.',
        },
      ];
    }
    return list;
  } catch {
    return [];
  }
}

function saveVehicleStatusHistoryLocal(vehicleId: string, log: VehicleStatusLog) {
  try {
    const history = localStorage.getItem(VEHICLE_STATUS_HISTORY_KEY);
    const parsed = history ? JSON.parse(history) : {};
    const list = parsed[vehicleId] || [
      {
        status: 'operational',
        changedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        reason: 'Unidad de transporte dada de alta en el sistema de flotas.',
      },
    ];
    list.push(log);
    parsed[vehicleId] = list;
    localStorage.setItem(VEHICLE_STATUS_HISTORY_KEY, JSON.stringify(parsed));
  } catch { /* ignore */ }
}

// ── Mappers ─────────────────────────────────────────────────────

const VEHICLE_STATUS_TO_FRONTEND: Record<string, VehicleStatus> = {
  OPERATIONAL: 'operational',
  ON_ROUTE: 'operational',
  IN_MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service',
};

const VEHICLE_STATUS_TO_BACKEND: Record<VehicleStatus, BackendVehicleResource['vehicleStatus']> = {
  operational: 'OPERATIONAL',
  maintenance: 'IN_MAINTENANCE',
  out_of_service: 'OUT_OF_SERVICE',
};

function toVehicle(backend: BackendVehicleResource): Vehicle {
  return {
    id: String(backend.id),
    plate: backend.plateNumber,
    type: backend.capacityKg > 5000 ? 'Camión de Carga Pesada' : 'Furgoneta de Reparto',
    capacity: backend.capacityKg,
    status: VEHICLE_STATUS_TO_FRONTEND[backend.vehicleStatus] ?? 'operational',
    year: new Date().getFullYear() - 2,
    brand: backend.capacityKg > 5000 ? 'Volvo' : 'Toyota',
    model: backend.capacityKg > 5000 ? 'FH16' : 'Hiace',
    lastMaintenance: new Date(Date.now() - 86400000 * 15).toLocaleDateString('es-PE'),
  };
}

function toCreateVehicleRequest(payload: CreateVehiclePayload): BackendCreateVehicleRequest {
  return { plateNumber: payload.plate, capacityKg: payload.capacity };
}

const DRIVER_STATUS_TO_FRONTEND: Record<BackendDriverResource['driverStatus'], DriverStatus> = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  OFFLINE: 'offline',
  ON_ROUTE: 'assigned',
  ON_BREAK: 'offline',
  UNAVAILABLE: 'offline',
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

const ROUTE_STATUS_TO_FRONTEND: Record<BackendRouteResource['routeStatus'], RouteStatus> = {
  PLANNED: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

function toRoute(backend: BackendRouteResource): Route {
  return {
    id: String(backend.id),
    code: backend.title || `Ruta #${backend.id}`,
    status: ROUTE_STATUS_TO_FRONTEND[backend.routeStatus] ?? 'pending',
    vehicleAssigned: backend.vehicleId ? String(backend.vehicleId) : null,
    driverAssigned: backend.driverId ? String(backend.driverId) : null,
    ordersCount: backend.ordersIds ? backend.ordersIds.length : 0,
  };
}

// ── Service ─────────────────────────────────────────────────────

export const fleetService = {
  // ── Vehicles ──────────────────────────────────────────────────
  async getVehicles(): Promise<Vehicle[]> {
    const response = await fleetApi.get<BackendVehicleListResponse | BackendVehicleResource[]>('/api/v1/vehicles');
    const list = Array.isArray(response.data) ? response.data : response.data.value || [];
    return list.map(toVehicle);
  },

  async getVehicleById(vehicleId: string): Promise<Vehicle> {
    const { data } = await fleetApi.get<BackendVehicleResource>(`/api/v1/vehicles/${vehicleId}`);
    return toVehicle(data);
  },

  async createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    const { data } = await fleetApi.post<BackendVehicleResource>('/api/v1/vehicles', toCreateVehicleRequest(payload));
    return toVehicle(data);
  },

  async updateVehicle(vehicleId: string, payload: CreateVehiclePayload): Promise<Vehicle> {
    const { data } = await fleetApi.put<BackendVehicleResource>(`/api/v1/vehicles/${vehicleId}`, toCreateVehicleRequest(payload));
    return toVehicle(data);
  },

  async updateVehicleStatus(vehicleId: string, status: VehicleStatus, reason: string): Promise<Vehicle> {
    const body = { vehicleStatus: VEHICLE_STATUS_TO_BACKEND[status] };
    const { data } = await fleetApi.patch<BackendVehicleResource>(`/api/v1/vehicles/${vehicleId}/status`, body);
    saveVehicleStatusHistoryLocal(vehicleId, {
      status,
      changedAt: new Date().toISOString(),
      reason: reason || 'Cambio de estado general.',
    });
    return toVehicle(data);
  },

  async getVehicleStatusHistory(vehicleId: string): Promise<VehicleStatusLog[]> {
    return getVehicleStatusHistoryLocal(vehicleId);
  },

  // ── Drivers ───────────────────────────────────────────────────
  async getDrivers(): Promise<Driver[]> {
    const response = await fleetApi.get<any>('/api/v1/drivers');
    const rawList = ensureArray<BackendDriverResource>(response.data, 'conductores');
    return rawList.map(toDriver);
  },

  async getDriverById(driverId: string): Promise<Driver> {
    const response = await fleetApi.get<BackendDriverResource>(`/api/v1/drivers/${driverId}`);
    return toDriver(response.data);
  },

  async createDriver(payload: CreateDriverPayload): Promise<Driver> {
    const response = await fleetApi.post<BackendDriverResource>('/api/v1/drivers', toCreateDriverRequest(payload));
    return toDriver(response.data);
  },

  // ── Routes ────────────────────────────────────────────────────
  async getRoutes(): Promise<Route[]> {
    const response = await fleetApi.get<any>('/api/v1/routes');
    const rawList = ensureArray<BackendRouteResource>(response.data, 'rutas');
    return rawList.map(toRoute);
  },

  async getRouteById(routeId: string): Promise<Route> {
    const response = await fleetApi.get<BackendRouteResource>(`/api/v1/routes/${routeId}`);
    return toRoute(response.data);
  },

  async assignVehicleToRoute(routeId: string, vehicleId: string): Promise<Route> {
    const response = await fleetApi.patch<BackendRouteResource>(`/api/v1/routes/${routeId}/vehicle`, { vehicleId });
    return toRoute(response.data);
  },

  async assignDriverToRoute(routeId: string, driverId: string): Promise<Route> {
    const response = await fleetApi.patch<BackendRouteResource>(`/api/v1/routes/${routeId}/driver`, { driverId });
    return toRoute(response.data);
  },

  async markRouteInProgress(routeId: string): Promise<Route> {
    const response = await fleetApi.patch<BackendRouteResource>(`/api/v1/routes/${routeId}/in-progress`);
    return toRoute(response.data);
  },
};
