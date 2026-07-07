import { fleetApi } from '@/services';
import type { BackendVehicleResource, CreateVehiclePayload, UpdateVehicleStatusPayload, Vehicle, VehicleHealthResource } from '../types';

type VehicleListResponse = BackendVehicleResource[] | { value?: BackendVehicleResource[]; data?: BackendVehicleResource[] };

function ensureArray(value: VehicleListResponse): BackendVehicleResource[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.value)) return value.value;
  if (Array.isArray(value.data)) return value.data;
  return [];
}

function toVehicle(resource: BackendVehicleResource): Vehicle {
  const statusByLegacyValue = {
    operational: 'OPERATIONAL',
    maintenance: 'IN_MAINTENANCE',
    out_of_service: 'OUT_OF_SERVICE',
  } as const;
  const status = resource.vehicleStatus ?? (resource.status && resource.status in statusByLegacyValue
    ? statusByLegacyValue[resource.status as keyof typeof statusByLegacyValue]
    : resource.status);

  return {
    id: String(resource.id),
    plateNumber: resource.plateNumber ?? resource.plate ?? `Vehiculo #${resource.id}`,
    capacityKg: resource.capacityKg ?? resource.capacity ?? 0,
    status: (status ?? 'OPERATIONAL') as Vehicle['status'],
  };
}

export const vehiclesService = {
  async getVehicles(): Promise<Vehicle[]> {
    const { data } = await fleetApi.get<VehicleListResponse>('/api/v1/vehicles');
    return ensureArray(data).map(toVehicle);
  },

  async getVehicleById(vehicleId: string): Promise<Vehicle> {
    const { data } = await fleetApi.get<BackendVehicleResource>(`/api/v1/vehicles/${vehicleId}`);
    return toVehicle(data);
  },

  async createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    const { data } = await fleetApi.post<BackendVehicleResource>('/api/v1/vehicles', {
      plateNumber: payload.plateNumber.trim(),
      capacityKg: payload.capacityKg,
    });
    return toVehicle(data);
  },

  async updateVehicleStatus(
    vehicleId: string,
    payload: UpdateVehicleStatusPayload,
    method: 'PATCH' | 'PUT' = 'PATCH',
  ): Promise<Vehicle> {
    const request =
      method === 'PUT'
        ? fleetApi.put<BackendVehicleResource>(`/api/v1/vehicles/${vehicleId}`, payload)
        : fleetApi.patch<BackendVehicleResource>(`/api/v1/vehicles/${vehicleId}`, payload);
    const { data } = await request;
    return toVehicle(data);
  },

  async getVehicleHealth(vehicleId: string): Promise<VehicleHealthResource> {
    const { data } = await fleetApi.get<VehicleHealthResource>(`/api/v1/desktop/vehicles/${vehicleId}/health`);
    return data;
  },
};
