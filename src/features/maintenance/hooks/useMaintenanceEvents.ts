import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { maintenanceService } from "../services/maintenanceService";
import type {
  MaintenanceOrder,
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

// ========== MAINTENANCE ORDERS - QUERIES ==========

export function useMaintenanceOrders() {
  return useQuery({
    queryKey: ["maintenance-orders"],
    queryFn: () => maintenanceService.getMaintenanceOrders(),
  });
}

export function useMaintenanceOrderById(orderId: number | undefined) {
  return useQuery({
    queryKey: ["maintenance-orders", orderId],
    queryFn: () => maintenanceService.getMaintenanceOrderById(orderId!),
    enabled: !!orderId,
  });
}

export function useMaintenanceOrdersByStatus(status: string) {
  return useQuery({
    queryKey: ["maintenance-orders", "status", status],
    queryFn: () => maintenanceService.getMaintenanceOrdersByStatus(status),
  });
}

export function useOpenMaintenanceOrdersByVehicle(
  vehicleId: number | undefined,
) {
  return useQuery({
    queryKey: ["maintenance-orders", "vehicle", vehicleId, "open"],
    queryFn: () =>
      maintenanceService.getOpenMaintenanceOrdersByVehicle(vehicleId!),
    enabled: !!vehicleId,
  });
}

export function useMaintenanceOrderHistory(vehicleId: number | undefined) {
  return useQuery({
    queryKey: ["maintenance-orders", "vehicle", vehicleId, "history"],
    queryFn: () => maintenanceService.getMaintenanceOrderHistory(vehicleId!),
    enabled: !!vehicleId,
  });
}

// ========== MAINTENANCE ORDERS - MUTATIONS ==========

export function useCreateMaintenanceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMaintenanceOrderPayload) =>
      maintenanceService.createMaintenanceOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

export function useScheduleMaintenanceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: ScheduleMaintenanceOrderPayload;
    }) => maintenanceService.scheduleMaintenanceOrder(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<MaintenanceOrder[]>(
        ["maintenance-orders"],
        (current) =>
          (current ?? []).map((order) =>
            order.id === updated.id ? updated : order,
          ),
      );
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

export function useStartMaintenanceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) =>
      maintenanceService.startMaintenanceOrder(orderId),
    onSuccess: (updated) => {
      queryClient.setQueryData<MaintenanceOrder[]>(
        ["maintenance-orders"],
        (current) =>
          (current ?? []).map((order) =>
            order.id === updated.id ? updated : order,
          ),
      );
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

export function useCompleteMaintenanceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: CompleteMaintenanceOrderPayload;
    }) => maintenanceService.completeMaintenanceOrder(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<MaintenanceOrder[]>(
        ["maintenance-orders"],
        (current) =>
          (current ?? []).map((order) =>
            order.id === updated.id ? updated : order,
          ),
      );
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

export function useCancelMaintenanceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: CancelMaintenanceOrderPayload;
    }) => maintenanceService.cancelMaintenanceOrder(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<MaintenanceOrder[]>(
        ["maintenance-orders"],
        (current) =>
          (current ?? []).map((order) =>
            order.id === updated.id ? updated : order,
          ),
      );
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

export function useRegisterJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: RegisterJobPayload;
    }) => maintenanceService.registerJob(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<MaintenanceOrder[]>(
        ["maintenance-orders"],
        (current) =>
          (current ?? []).map((order) =>
            order.id === updated.id ? updated : order,
          ),
      );
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

export function useRequestParts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: RequestPartsPayload;
    }) => maintenanceService.requestParts(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<MaintenanceOrder[]>(
        ["maintenance-orders"],
        (current) =>
          (current ?? []).map((order) =>
            order.id === updated.id ? updated : order,
          ),
      );
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

export function useReceiveParts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: ReceivePartsPayload;
    }) => maintenanceService.receiveParts(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<MaintenanceOrder[]>(
        ["maintenance-orders"],
        (current) =>
          (current ?? []).map((order) =>
            order.id === updated.id ? updated : order,
          ),
      );
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

export function useRegisterCost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: RegisterCostPayload;
    }) => maintenanceService.registerCost(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<MaintenanceOrder[]>(
        ["maintenance-orders"],
        (current) =>
          (current ?? []).map((order) =>
            order.id === updated.id ? updated : order,
          ),
      );
      void queryClient.invalidateQueries({ queryKey: ["maintenance-orders"] });
    },
  });
}

// ========== MAINTENANCE SCHEDULES - QUERIES ==========

export function useMaintenanceScheduleById(scheduleId: number | undefined) {
  return useQuery({
    queryKey: ["maintenance-schedules", scheduleId],
    queryFn: () => maintenanceService.getMaintenanceScheduleById(scheduleId!),
    enabled: !!scheduleId,
  });
}

// ========== MAINTENANCE SCHEDULES - MUTATIONS ==========

export function useCreateMaintenanceSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMaintenanceSchedulePayload) =>
      maintenanceService.createMaintenanceSchedule(payload),
    onSuccess: (created) => {
      queryClient.setQueryData(["maintenance-schedules", created.id], created);
    },
  });
}

export function useActivateMaintenanceSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: number) =>
      maintenanceService.activateMaintenanceSchedule(scheduleId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["maintenance-schedules", updated.id], updated);
    },
  });
}

export function useDeactivateMaintenanceSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: number) =>
      maintenanceService.deactivateMaintenanceSchedule(scheduleId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["maintenance-schedules", updated.id], updated);
    },
  });
}

export function useEvaluateMaintenanceSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: number) =>
      maintenanceService.evaluateMaintenanceSchedule(scheduleId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["maintenance-schedules", updated.id], updated);
    },
  });
}

export function useUpdateMaintenanceRules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scheduleId,
      payload,
    }: {
      scheduleId: number;
      payload: UpdateMaintenanceRulesPayload;
    }) => maintenanceService.updateMaintenanceRules(scheduleId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["maintenance-schedules", updated.id], updated);
    },
  });
}
