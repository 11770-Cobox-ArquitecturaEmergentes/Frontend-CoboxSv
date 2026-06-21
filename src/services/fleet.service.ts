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
  licenceNumber: string;
  driverStatus: 'AVAILABLE' | 'ON_ROUTE' | 'ON_BREAK' | 'UNAVAILABLE';
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

// ── Local Storage Override Mechanism (Simulating Vehicle Status Updates) ──

const VEHICLE_STATUS_OVERRIDES_KEY = 'cobox_vehicle_status_overrides';
const VEHICLE_STATUS_HISTORY_KEY = 'cobox_vehicle_status_history';

function getVehicleStatusOverride(vehicleId: string): VehicleStatus | null {
  try {
    const overrides = localStorage.getItem(VEHICLE_STATUS_OVERRIDES_KEY);
    if (!overrides) return null;
    const parsed = JSON.parse(overrides);
    return parsed[vehicleId] || null;
  } catch {
    return null;
  }
}

function saveVehicleStatusOverride(vehicleId: string, status: VehicleStatus) {
  try {
    const overrides = localStorage.getItem(VEHICLE_STATUS_OVERRIDES_KEY);
    const parsed = overrides ? JSON.parse(overrides) : {};
    parsed[vehicleId] = status;
    localStorage.setItem(VEHICLE_STATUS_OVERRIDES_KEY, JSON.stringify(parsed));
  } catch { /* ignore */ }
}

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

function toVehicle(backend: BackendVehicleResource): Vehicle {
  const localOverride = getVehicleStatusOverride(String(backend.id));
  return {
    id: String(backend.id),
    plate: backend.plateNumber,
    type: backend.capacityKg > 5000 ? 'Camión de Carga Pesada' : 'Furgoneta de Reparto',
    capacity: backend.capacityKg,
    status: localOverride || (VEHICLE_STATUS_TO_FRONTEND[backend.vehicleStatus] ?? 'operational'),
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
  ON_ROUTE: 'assigned',
  ON_BREAK: 'offline',
  UNAVAILABLE: 'offline',
};

function toDriver(backend: BackendDriverResource): Driver {
  return {
    id: String(backend.id),
    name: `Conductor #${backend.id}`,
    license: backend.licenceNumber,
    status: DRIVER_STATUS_TO_FRONTEND[backend.driverStatus] ?? 'available',
    assignedRoutes: 0,
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

  async updateVehicleStatus(vehicleId: string, status: VehicleStatus, reason: string): Promise<Vehicle> {
    // Simulating status change via local overrides
    saveVehicleStatusOverride(vehicleId, status);
    saveVehicleStatusHistoryLocal(vehicleId, {
      status,
      changedAt: new Date().toISOString(),
      reason: reason || 'Cambio de estado general.',
    });
    // Return enriched vehicle
    return this.getVehicleById(vehicleId);
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
    const response = await fleetApi.post<BackendDriverResource>('/api/v1/drivers', {
      licenceNumber: payload.license,
    });
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
