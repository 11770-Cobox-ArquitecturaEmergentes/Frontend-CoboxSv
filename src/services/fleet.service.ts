import { fleetApi } from './api';
import type {
  CreateDriverPayload,
  CreateVehiclePayload,
  Driver,
  Route,
  Vehicle,
} from '@/modules/fleet.types';

type ApiEnvelope<T> = {
  data: T;
};

function unwrapApiData<T>(payload: T | ApiEnvelope<T>): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    Object.keys(payload).length === 1
  ) {
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

export const fleetService = {
  async getVehicles() {
    const response = await fleetApi.get<Vehicle[] | ApiEnvelope<Vehicle[]>>('/api/v1/vehicles');
    return ensureArray(unwrapApiData<Vehicle[]>(response.data), 'vehiculos');
  },

  async getVehicleById(vehicleId: string) {
    const response = await fleetApi.get<Vehicle | ApiEnvelope<Vehicle>>(`/api/v1/vehicles/${vehicleId}`);
    return unwrapApiData<Vehicle>(response.data);
  },

  async createVehicle(payload: CreateVehiclePayload) {
    const response = await fleetApi.post<Vehicle | ApiEnvelope<Vehicle>>('/api/v1/vehicles', payload);
    return unwrapApiData<Vehicle>(response.data);
  },

  async getDrivers() {
    const response = await fleetApi.get<Driver[] | ApiEnvelope<Driver[]>>('/api/v1/drivers');
    return ensureArray(unwrapApiData<Driver[]>(response.data), 'conductores');
  },

  async getDriverById(driverId: string) {
    const response = await fleetApi.get<Driver | ApiEnvelope<Driver>>(`/api/v1/drivers/${driverId}`);
    return unwrapApiData<Driver>(response.data);
  },

  async createDriver(payload: CreateDriverPayload) {
    const response = await fleetApi.post<Driver | ApiEnvelope<Driver>>('/api/v1/drivers', payload);
    return unwrapApiData<Driver>(response.data);
  },

  async getRoutes() {
    const response = await fleetApi.get<Route[] | ApiEnvelope<Route[]>>('/api/v1/routes');
    return ensureArray(unwrapApiData<Route[]>(response.data), 'rutas');
  },

  async getRouteById(routeId: string) {
    const response = await fleetApi.get<Route | ApiEnvelope<Route>>(`/api/v1/routes/${routeId}`);
    return unwrapApiData<Route>(response.data);
  },

  async assignVehicleToRoute(routeId: string, vehicleId: string) {
    const response = await fleetApi.patch<Route | ApiEnvelope<Route>>(`/api/v1/routes/${routeId}/vehicle`, {
      vehicleId,
    });
    return unwrapApiData<Route>(response.data);
  },

  async assignDriverToRoute(routeId: string, driverId: string) {
    const response = await fleetApi.patch<Route | ApiEnvelope<Route>>(`/api/v1/routes/${routeId}/driver`, {
      driverId,
    });
    return unwrapApiData<Route>(response.data);
  },

  async markRouteInProgress(routeId: string) {
    const response = await fleetApi.patch<Route | ApiEnvelope<Route>>(`/api/v1/routes/${routeId}/in-progress`);
    return unwrapApiData<Route>(response.data);
  },
};
