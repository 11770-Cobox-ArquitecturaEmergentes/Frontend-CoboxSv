import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../services/ordersService';
import { useRoutes } from '@/modules/routes';
import { useDrivers } from '@/modules/drivers';
import { useVehicles } from '@/modules/vehicles';
import type { CreateOrderPayload, MarkAsCompletedPayload, Order } from '../types';

export function useOrders() {
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getOrders,
  });

  const routesQuery = useRoutes();
  const driversQuery = useDrivers();
  const vehiclesQuery = useVehicles();

  const isError = ordersQuery.isError || routesQuery.isError || driversQuery.isError || vehiclesQuery.isError;
  const isLoading = ordersQuery.isLoading || routesQuery.isLoading || driversQuery.isLoading || vehiclesQuery.isLoading;

  const refetch = async () => {
    await Promise.all([
      ordersQuery.refetch(),
      routesQuery.refetch(),
      driversQuery.refetch(),
      vehiclesQuery.refetch(),
    ]);
  };

  // Cruce de información
  const data = ordersQuery.data;
  const routes = routesQuery.data;
  const drivers = driversQuery.data;
  const vehicles = vehiclesQuery.data;

  const enrichedOrders: Order[] = (data || []).map((order) => {
    // Buscar si esta orden pertenece a alguna ruta
    const assignedRoute = (routes || []).find((r) => {
      // route.ordersIds contiene orderId en formato { orderId: number } o similar según API
      const orderIds = (r as any).ordersIds || [];
      return orderIds.some((o: any) => {
        if (typeof o === 'object' && o !== null && 'orderId' in o) {
          return String(o.orderId) === String(order.id);
        }
        return String(o) === String(order.id);
      });
    });

    let driverName: string | undefined;
    let vehiclePlate: string | undefined;

    if (assignedRoute) {
      // Buscar conductor
      if (assignedRoute.driverAssigned) {
        const driver = (drivers || []).find((d) => String(d.id) === String(assignedRoute.driverAssigned));
        driverName = driver ? driver.name : `Conductor #${assignedRoute.driverAssigned}`;
      }

      // Buscar vehículo
      if (assignedRoute.vehicleAssigned) {
        const vehicle = (vehicles || []).find((v) => String(v.id) === String(assignedRoute.vehicleAssigned));
        vehiclePlate = vehicle ? vehicle.plate : `Vehículo #${assignedRoute.vehicleAssigned}`;
      }
    }

    return {
      ...order,
      assignedRouteId: assignedRoute?.id,
      driverName,
      vehiclePlate,
    };
  });

  return {
    data: enrichedOrders,
    isLoading,
    isError,
    refetch,
  };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersService.createOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useMarkOrderReady() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersService.markReadyForDispatch(orderId),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<Order[]>(['orders'], (current) =>
        (current ?? []).map((order) => (order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order)),
      );
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useMarkOrderInTransit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersService.markInTransit(orderId),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<Order[]>(['orders'], (current) =>
        (current ?? []).map((order) => (order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order)),
      );
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useMarkOrderCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: MarkAsCompletedPayload }) =>
      ordersService.markCompleted(orderId, payload),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<Order[]>(['orders'], (current) =>
        (current ?? []).map((order) => (order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order)),
      );
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      // También invalidamos rutas porque finalizar una orden puede completar la ruta en el backend
      void queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
