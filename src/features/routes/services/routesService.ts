import { fleetApi } from '@/services';
import type {
  AssignDriverPayload,
  AssignVehiclePayload,
  BackendOrderIdResource,
  BackendRouteResource,
  CreateRoutePayload,
  Route,
  RouteOrderPayload,
} from '../types';

function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object' && 'value' in value && Array.isArray(value.value)) return value.value;
  if (value && typeof value === 'object' && 'data' in value && Array.isArray(value.data)) return value.data;
  return [];
}

function toOrderId(value: BackendOrderIdResource | number | string): string {
  if (typeof value === 'object' && value !== null && 'orderId' in value) return String(value.orderId);
  return String(value);
}

export function toRoute(resource: BackendRouteResource): Route {
  return {
    id: String(resource.id),
    title: resource.title ?? `Ruta #${resource.id}`,
    vehicleId: resource.vehicleId == null ? null : String(resource.vehicleId),
    driverId: resource.driverId == null ? null : String(resource.driverId),
    orderIds: ensureArray<BackendOrderIdResource | number | string>(resource.ordersIds).map(toOrderId),
    finishedOrderIds: ensureArray<BackendOrderIdResource | number | string>(resource.finishedOrderIds).map(toOrderId),
    status: resource.routeStatus,
  };
}

function toPositiveNumber(value: string) {
  return Number(value);
}

export const routesService = {
  async getRoutes(): Promise<Route[]> {
    const { data } = await fleetApi.get<BackendRouteResource[] | { value?: BackendRouteResource[]; data?: BackendRouteResource[] }>(
      '/api/v1/routes',
    );
    return ensureArray<BackendRouteResource>(data).map(toRoute);
  },

  async createRoute(payload: CreateRoutePayload): Promise<Route> {
    const { data } = await fleetApi.post<BackendRouteResource>('/api/v1/routes', { title: payload.title.trim() });
    return toRoute(data);
  },

  async getRouteById(routeId: string): Promise<Route> {
    const { data } = await fleetApi.get<BackendRouteResource>(`/api/v1/routes/${routeId}`);
    return toRoute(data);
  },

  async addOrderToRoute(routeId: string, payload: RouteOrderPayload): Promise<Route> {
    const { data } = await fleetApi.post<BackendRouteResource>(`/api/v1/routes/${routeId}/orders`, {
      orderId: toPositiveNumber(payload.orderId),
    });
    return toRoute(data);
  },

  async addDeliveredOrderToRoute(routeId: string, payload: RouteOrderPayload): Promise<Route> {
    const { data } = await fleetApi.post<BackendRouteResource>(`/api/v1/routes/${routeId}/delivered-orders`, {
      orderId: toPositiveNumber(payload.orderId),
    });
    return toRoute(data);
  },

  async assignDriverToRoute(routeId: string, payload: AssignDriverPayload): Promise<Route> {
    const { data } = await fleetApi.patch<BackendRouteResource>(`/api/v1/routes/${routeId}/driver`, {
      driverId: toPositiveNumber(payload.driverId),
    });
    return toRoute(data);
  },

  async assignVehicleToRoute(routeId: string, payload: AssignVehiclePayload): Promise<Route> {
    const { data } = await fleetApi.patch<BackendRouteResource>(`/api/v1/routes/${routeId}/vehicle`, {
      vehicleId: toPositiveNumber(payload.vehicleId),
    });
    return toRoute(data);
  },

  async markRouteInProgress(routeId: string): Promise<Route> {
    const { data } = await fleetApi.patch<BackendRouteResource>(`/api/v1/routes/${routeId}/in-progress`);
    return toRoute(data);
  },
};
