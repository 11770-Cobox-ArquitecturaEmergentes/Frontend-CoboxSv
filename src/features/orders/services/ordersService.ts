import { fleetApi } from '@/services';
import type { BackendOrderResource, CreateOrderPayload, MarkAsCompletedPayload, Order } from '../types';

function toOrder(backend: BackendOrderResource): Order {
  return {
    id: String(backend.id),
    clientId: backend.clientId,
    addressLine: backend.addressLine,
    city: backend.city,
    country: backend.country,
    postalCode: backend.postalCode,
    referenceLatitude: backend.referenceLatitude,
    referenceLongitude: backend.referenceLongitude,
    notes: backend.notes,
    weightKg: backend.weightKg,
    status: backend.orderStatus,
  };
}

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    const { data } = await fleetApi.get<BackendOrderResource[]>('/api/v1/orders');
    return (data || []).map(toOrder);
  },

  async getOrderById(orderId: string): Promise<Order> {
    const { data } = await fleetApi.get<BackendOrderResource>(`/api/v1/orders/${orderId}`);
    return toOrder(data);
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await fleetApi.post<BackendOrderResource>('/api/v1/orders', payload);
    return toOrder(data);
  },

  async markReadyForDispatch(orderId: string): Promise<Order> {
    const { data } = await fleetApi.patch<BackendOrderResource>(`/api/v1/orders/${orderId}/ready-for-dispatch`);
    return toOrder(data);
  },

  async markInTransit(orderId: string): Promise<Order> {
    const { data } = await fleetApi.patch<BackendOrderResource>(`/api/v1/orders/${orderId}/in-transit`);
    return toOrder(data);
  },

  async markCompleted(orderId: string, payload: MarkAsCompletedPayload): Promise<Order> {
    const { data } = await fleetApi.patch<BackendOrderResource>(`/api/v1/orders/${orderId}/completed`, payload);
    return toOrder(data);
  },
};
