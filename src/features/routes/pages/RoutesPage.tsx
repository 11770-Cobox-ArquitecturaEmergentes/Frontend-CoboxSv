import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ApiErrorState } from '@/components/shared';
import { Button, Card, Input, Select, Skeleton, useToast } from '@/components/ui';
import { useDrivers } from '@/features/drivers';
import { ordersService } from '@/features/orders/services';
import { useVehicles } from '@/modules/vehicles';
import {
  AddDeliveredOrderToRouteDialog,
  AddOrderToRouteDialog,
  AssignDriverToRouteDialog,
  AssignVehicleToRouteDialog,
  CreateRouteDialog,
  RouteCard,
  RouteDetailsPanel,
} from '../components';
import {
  useAddDeliveredOrderToRoute,
  useAddOrderToRoute,
  useAssignDriverToRoute,
  useAssignVehicleToRoute,
  useCreateRoute,
  useMarkRouteInProgress,
  useRoutes,
} from '../hooks';
import type { CreateRoutePayload, Route, RouteStatus } from '../types';
import { validatePositiveId } from '../validations';

type RouteAction = 'driver' | 'vehicle' | 'order' | 'delivered';

const statusOptions: { value: 'all' | RouteStatus; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'PLANNED', label: 'Planificadas' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'COMPLETED', label: 'Completadas' },
];

export function RoutesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RouteStatus>('all');
  const [driverFilter, setDriverFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>();
  const [actionRoute, setActionRoute] = useState<Route | null>(null);
  const [action, setAction] = useState<RouteAction | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');

  const routesQuery = useRoutes();
  const driversQuery = useDrivers();
  const vehiclesQuery = useVehicles();
  const ordersQuery = useQuery({
    queryKey: ['orders', 'route-actions'],
    queryFn: ordersService.getOrders,
  });

  const createRoute = useCreateRoute();
  const assignDriver = useAssignDriverToRoute();
  const assignVehicle = useAssignVehicleToRoute();
  const addOrder = useAddOrderToRoute();
  const addDeliveredOrder = useAddDeliveredOrderToRoute();
  const markInProgress = useMarkRouteInProgress();
  const { toast } = useToast();

  const routes = useMemo(() => routesQuery.data ?? [], [routesQuery.data]);
  const drivers = useMemo(() => driversQuery.data ?? [], [driversQuery.data]);
  const vehicles = useMemo(() => vehiclesQuery.data ?? [], [vehiclesQuery.data]);
  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);
  const selectedRoute = useMemo(() => routes.find((route) => route.id === selectedRouteId), [routes, selectedRouteId]);

  const driverById = useMemo(() => new Map(drivers.map((driver) => [driver.id, driver])), [drivers]);
  const vehicleById = useMemo(() => new Map(vehicles.map((vehicle) => [vehicle.id, vehicle])), [vehicles]);

  const filteredRoutes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return routes.filter((route) => {
      const driver = route.driverId ? driverById.get(route.driverId) : null;
      const vehicle = route.vehicleId ? vehicleById.get(route.vehicleId) : null;
      const matchesSearch =
        !term ||
        route.id.toLowerCase().includes(term) ||
        route.title.toLowerCase().includes(term) ||
        driver?.email.toLowerCase().includes(term) ||
        driver?.licenceNumber.toLowerCase().includes(term) ||
        vehicle?.plate.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
      const matchesDriver = driverFilter === 'all' || route.driverId === driverFilter;
      const matchesVehicle = vehicleFilter === 'all' || route.vehicleId === vehicleFilter;

      return matchesSearch && matchesStatus && matchesDriver && matchesVehicle;
    });
  }, [driverById, driverFilter, routes, search, statusFilter, vehicleById, vehicleFilter]);

  const actionCandidateOrders = useMemo(() => {
    if (!actionRoute) return [];

    if (action === 'delivered') {
      return orders.filter((order) => actionRoute.orderIds.includes(order.id) && !actionRoute.finishedOrderIds.includes(order.id));
    }

    return orders.filter(
      (order) =>
        order.status !== 'DELIVERED' &&
        order.status !== 'CANCELLED' &&
        !actionRoute.orderIds.includes(order.id),
    );
  }, [action, actionRoute, orders]);

  const closeAction = () => {
    setActionRoute(null);
    setAction(null);
    setSelectedDriverId('');
    setSelectedVehicleId('');
    setSelectedOrderId('');
  };

  const openAction = (route: Route, nextAction: RouteAction) => {
    setActionRoute(route);
    setAction(nextAction);
    setSelectedDriverId(nextAction === 'driver' ? route.driverId ?? '' : '');
    setSelectedVehicleId(nextAction === 'vehicle' ? route.vehicleId ?? '' : '');
    setSelectedOrderId('');
  };

  const driverLabel = (route: Route) => {
    const driver = route.driverId ? driverById.get(route.driverId) : null;
    return driver ? `${driver.email} - ${driver.licenceNumber}` : route.driverId ? `Conductor #${route.driverId}` : 'Sin asignar';
  };

  const vehicleLabel = (route: Route) => {
    const vehicle = route.vehicleId ? vehicleById.get(route.vehicleId) : null;
    return vehicle ? vehicle.plate : route.vehicleId ? `Vehiculo #${route.vehicleId}` : 'Sin asignar';
  };

  const handleCreateRoute = (payload: CreateRoutePayload) => {
    createRoute.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false);
        toast({ title: 'Ruta creada correctamente', type: 'success' });
      },
      onError: () => toast({ title: 'No se pudo crear la ruta', type: 'error' }),
    });
  };

  const handleAssignDriver = () => {
    if (!actionRoute || !selectedDriverId) return;
    const validationError = validatePositiveId(selectedDriverId, 'El conductor');
    if (validationError) {
      toast({ title: validationError, type: 'error' });
      return;
    }
    assignDriver.mutate(
      { routeId: actionRoute.id, payload: { driverId: selectedDriverId } },
      {
        onSuccess: () => {
          closeAction();
          toast({ title: 'Conductor asignado a la ruta', type: 'success' });
        },
        onError: () => toast({ title: 'No se pudo asignar el conductor', type: 'error' }),
      },
    );
  };

  const handleAssignVehicle = () => {
    if (!actionRoute || !selectedVehicleId) return;
    const validationError = validatePositiveId(selectedVehicleId, 'El vehiculo');
    if (validationError) {
      toast({ title: validationError, type: 'error' });
      return;
    }
    assignVehicle.mutate(
      { routeId: actionRoute.id, payload: { vehicleId: selectedVehicleId } },
      {
        onSuccess: () => {
          closeAction();
          toast({ title: 'Vehiculo asignado a la ruta', type: 'success' });
        },
        onError: () => toast({ title: 'No se pudo asignar el vehiculo', type: 'error' }),
      },
    );
  };

  const handleAddOrder = () => {
    if (!actionRoute || !selectedOrderId) return;
    const validationError = validatePositiveId(selectedOrderId, 'La orden');
    if (validationError) {
      toast({ title: validationError, type: 'error' });
      return;
    }
    addOrder.mutate(
      { routeId: actionRoute.id, payload: { orderId: selectedOrderId } },
      {
        onSuccess: () => {
          closeAction();
          toast({ title: 'Orden agregada a la ruta', type: 'success' });
        },
        onError: () => toast({ title: 'No se pudo agregar la orden', type: 'error' }),
      },
    );
  };

  const handleAddDeliveredOrder = () => {
    if (!actionRoute || !selectedOrderId) return;
    const validationError = validatePositiveId(selectedOrderId, 'La orden');
    if (validationError) {
      toast({ title: validationError, type: 'error' });
      return;
    }
    addDeliveredOrder.mutate(
      { routeId: actionRoute.id, payload: { orderId: selectedOrderId } },
      {
        onSuccess: () => {
          closeAction();
          toast({ title: 'Orden registrada como entregada', type: 'success' });
        },
        onError: () => toast({ title: 'No se pudo registrar la orden entregada', type: 'error' }),
      },
    );
  };

  const handleStartRoute = (routeId: string) => {
    markInProgress.mutate(routeId, {
      onSuccess: () => toast({ title: 'Ruta iniciada correctamente', type: 'success' }),
      onError: () => toast({ title: 'No se pudo iniciar la ruta', type: 'error' }),
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Gestion de rutas</h1>
          <p className="mt-2 text-sm text-[#64748B]">Administra rutas, asignaciones y avance de entregas.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Crear ruta
        </Button>
      </div>

      <Card className="grid gap-4 p-5 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar ruta, conductor o vehiculo..."
            className="pl-9"
          />
        </div>
        <Select value={driverFilter} onChange={(event) => setDriverFilter(event.target.value)}>
          <option value="all">Todos los conductores</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.email}
            </option>
          ))}
        </Select>
        <Select value={vehicleFilter} onChange={(event) => setVehicleFilter(event.target.value)}>
          <option value="all">Todos los vehiculos</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plate}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | RouteStatus)}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {routesQuery.isError ? (
          <div className="md:col-span-2 xl:col-span-3">
            <ApiErrorState onRetry={() => void routesQuery.refetch()} />
          </div>
        ) : routesQuery.isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-72" />)
        ) : (
          filteredRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              driverLabel={driverLabel(route)}
              vehicleLabel={vehicleLabel(route)}
              isStarting={markInProgress.isPending}
              onAssignDriver={(selectedRoute) => openAction(selectedRoute, 'driver')}
              onAssignVehicle={(selectedRoute) => openAction(selectedRoute, 'vehicle')}
              onAddOrder={(selectedRoute) => openAction(selectedRoute, 'order')}
              onAddDeliveredOrder={(selectedRoute) => openAction(selectedRoute, 'delivered')}
              onStartRoute={handleStartRoute}
              onViewDetails={setSelectedRouteId}
            />
          ))
        )}
      </div>

      {!routesQuery.isLoading && !routesQuery.isError && filteredRoutes.length === 0 ? (
        <Card className="p-10 text-center text-sm text-[#64748B]">No hay rutas para mostrar.</Card>
      ) : null}

      <CreateRouteDialog
        open={isCreateOpen}
        isSubmitting={createRoute.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateRoute}
      />

      <AssignDriverToRouteDialog
        open={action === 'driver'}
        route={actionRoute}
        drivers={drivers}
        selectedDriverId={selectedDriverId}
        isSubmitting={assignDriver.isPending}
        onSelectedDriverChange={setSelectedDriverId}
        onClose={closeAction}
        onSubmit={handleAssignDriver}
      />

      <AssignVehicleToRouteDialog
        open={action === 'vehicle'}
        route={actionRoute}
        selectedVehicleId={selectedVehicleId}
        isSubmitting={assignVehicle.isPending}
        onSelectedVehicleChange={setSelectedVehicleId}
        onClose={closeAction}
        onSubmit={handleAssignVehicle}
      />

      <AddOrderToRouteDialog
        open={action === 'order'}
        route={actionRoute}
        orders={actionCandidateOrders}
        selectedOrderId={selectedOrderId}
        isSubmitting={addOrder.isPending || ordersQuery.isLoading}
        onSelectedOrderChange={setSelectedOrderId}
        onClose={closeAction}
        onSubmit={handleAddOrder}
      />

      <AddDeliveredOrderToRouteDialog
        open={action === 'delivered'}
        route={actionRoute}
        orders={actionCandidateOrders}
        selectedOrderId={selectedOrderId}
        isSubmitting={addDeliveredOrder.isPending || ordersQuery.isLoading}
        onSelectedOrderChange={setSelectedOrderId}
        onClose={closeAction}
        onSubmit={handleAddDeliveredOrder}
      />

      {selectedRouteId !== undefined ? (
        <RouteDetailsPanel
          routeId={selectedRouteId}
          driverLabel={selectedRoute ? driverLabel(selectedRoute) : 'Sin asignar'}
          vehicleLabel={selectedRoute ? vehicleLabel(selectedRoute) : 'Sin asignar'}
          isStarting={markInProgress.isPending}
          onClose={() => setSelectedRouteId(undefined)}
          onStartRoute={handleStartRoute}
        />
      ) : null}
    </section>
  );
}
