import { fleetApi } from "@/services";
import type {
  BackendMaintenanceOrderResource,
  BackendMaintenanceScheduleResource,
  MaintenanceOrder,
  MaintenanceSchedule,
  CreateMaintenanceOrderPayload,
  ScheduleMaintenanceOrderPayload,
  CompleteMaintenanceOrderPayload,
  CancelMaintenanceOrderPayload,
  RegisterJobPayload,
  RequestPartsPayload,
  ReceivePartsPayload,
  RegisterCostPayload,
  CreateMaintenanceSchedulePayload,
  UpdateMaintenanceRulesPayload,
} from "../types";

/**
 * Mapea la respuesta del backend a nuestro modelo de dominio
 */
function toMaintenanceOrder(
  backend: BackendMaintenanceOrderResource,
): MaintenanceOrder {
  return backend;
}

function toMaintenanceSchedule(
  backend: BackendMaintenanceScheduleResource,
): MaintenanceSchedule {
  return backend;
}

export const maintenanceService = {
  // ========== MAINTENANCE ORDERS ==========

  /**
   * Obtiene todas las órdenes de mantenimiento
   */
  async getMaintenanceOrders(): Promise<MaintenanceOrder[]> {
    const { data } = await fleetApi.get<BackendMaintenanceOrderResource[]>(
      "/api/v1/maintenance-orders",
    );
    return (data || []).map(toMaintenanceOrder);
  },

  /**
   * Obtiene una orden de mantenimiento por ID
   */
  async getMaintenanceOrderById(orderId: number): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.get<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}`,
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Obtiene órdenes por estado
   */
  async getMaintenanceOrdersByStatus(
    status: string,
  ): Promise<MaintenanceOrder[]> {
    const { data } = await fleetApi.get<BackendMaintenanceOrderResource[]>(
      `/api/v1/maintenance-orders/status/${status}`,
    );
    return (data || []).map(toMaintenanceOrder);
  },

  /**
   * Obtiene órdenes abiertas de un vehículo
   */
  async getOpenMaintenanceOrdersByVehicle(
    vehicleId: number,
  ): Promise<MaintenanceOrder[]> {
    const { data } = await fleetApi.get<BackendMaintenanceOrderResource[]>(
      `/api/v1/maintenance-orders/vehicle/${vehicleId}/open`,
    );
    return (data || []).map(toMaintenanceOrder);
  },

  /**
   * Verifica si un vehículo tiene orden abierta
   */
  async hasOpenMaintenanceOrder(vehicleId: number): Promise<boolean> {
    const { data } = await fleetApi.get<boolean>(
      `/api/v1/maintenance-orders/vehicle/${vehicleId}/has-open`,
    );
    return data;
  },

  /**
   * Obtiene historial de órdenes de un vehículo
   */
  async getMaintenanceOrderHistory(
    vehicleId: number,
  ): Promise<MaintenanceOrder[]> {
    const { data } = await fleetApi.get<BackendMaintenanceOrderResource[]>(
      `/api/v1/maintenance-orders/vehicle/${vehicleId}/history`,
    );
    return (data || []).map(toMaintenanceOrder);
  },

  /**
   * Crea una nueva orden de mantenimiento
   */
  async createMaintenanceOrder(
    payload: CreateMaintenanceOrderPayload,
  ): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      "/api/v1/maintenance-orders",
      payload,
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Programa una orden de mantenimiento
   */
  async scheduleMaintenanceOrder(
    orderId: number,
    payload: ScheduleMaintenanceOrderPayload,
  ): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}/schedule`,
      payload,
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Inicia una orden de mantenimiento
   */
  async startMaintenanceOrder(orderId: number): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}/start`,
      {},
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Completa una orden de mantenimiento
   */
  async completeMaintenanceOrder(
    orderId: number,
    payload: CompleteMaintenanceOrderPayload,
  ): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}/complete`,
      payload,
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Cancela una orden de mantenimiento
   */
  async cancelMaintenanceOrder(
    orderId: number,
    payload: CancelMaintenanceOrderPayload,
  ): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}/cancel`,
      payload,
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Registra un trabajo en una orden
   */
  async registerJob(
    orderId: number,
    payload: RegisterJobPayload,
  ): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}/jobs`,
      payload,
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Solicita repuestos para una orden
   */
  async requestParts(
    orderId: number,
    payload: RequestPartsPayload,
  ): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}/parts/request`,
      payload,
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Recibe repuestos solicitados
   */
  async receiveParts(
    orderId: number,
    payload: ReceivePartsPayload,
  ): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}/parts/receive`,
      payload,
    );
    return toMaintenanceOrder(data);
  },

  /**
   * Registra costo en una orden
   */
  async registerCost(
    orderId: number,
    payload: RegisterCostPayload,
  ): Promise<MaintenanceOrder> {
    const { data } = await fleetApi.post<BackendMaintenanceOrderResource>(
      `/api/v1/maintenance-orders/${orderId}/cost`,
      payload,
    );
    return toMaintenanceOrder(data);
  },

  // ========== MAINTENANCE SCHEDULES ==========

  /**
   * Obtiene un cronograma por ID
   */
  async getMaintenanceScheduleById(
    scheduleId: number,
  ): Promise<MaintenanceSchedule> {
    const { data } = await fleetApi.get<BackendMaintenanceScheduleResource>(
      `/api/v1/maintenance-schedules/${scheduleId}`,
    );
    return toMaintenanceSchedule(data);
  },

  /**
   * Crea un nuevo cronograma de mantenimiento
   */
  async createMaintenanceSchedule(
    payload: CreateMaintenanceSchedulePayload,
  ): Promise<MaintenanceSchedule> {
    const { data } = await fleetApi.post<BackendMaintenanceScheduleResource>(
      "/api/v1/maintenance-schedules",
      payload,
    );
    return toMaintenanceSchedule(data);
  },

  /**
   * Activa un cronograma de mantenimiento
   */
  async activateMaintenanceSchedule(
    scheduleId: number,
  ): Promise<MaintenanceSchedule> {
    const { data } = await fleetApi.post<BackendMaintenanceScheduleResource>(
      `/api/v1/maintenance-schedules/${scheduleId}/activate`,
      {},
    );
    return toMaintenanceSchedule(data);
  },

  /**
   * Desactiva un cronograma de mantenimiento
   */
  async deactivateMaintenanceSchedule(
    scheduleId: number,
  ): Promise<MaintenanceSchedule> {
    const { data } = await fleetApi.post<BackendMaintenanceScheduleResource>(
      `/api/v1/maintenance-schedules/${scheduleId}/deactivate`,
      {},
    );
    return toMaintenanceSchedule(data);
  },

  /**
   * Evalúa un cronograma de mantenimiento
   */
  async evaluateMaintenanceSchedule(
    scheduleId: number,
  ): Promise<MaintenanceSchedule> {
    const { data } = await fleetApi.post<BackendMaintenanceScheduleResource>(
      `/api/v1/maintenance-schedules/${scheduleId}/evaluate`,
      {},
    );
    return toMaintenanceSchedule(data);
  },

  /**
   * Actualiza las reglas de un cronograma
   */
  async updateMaintenanceRules(
    scheduleId: number,
    payload: UpdateMaintenanceRulesPayload,
  ): Promise<MaintenanceSchedule> {
    const { data } = await fleetApi.put<BackendMaintenanceScheduleResource>(
      `/api/v1/maintenance-schedules/${scheduleId}/rules`,
      payload,
    );
    return toMaintenanceSchedule(data);
  },
};
