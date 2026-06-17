import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { MapPinned, Play, RouteIcon, Truck, UserRound } from 'lucide-react';
import { Badge, Button, Card, Dialog, Select, Skeleton, useToast } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import type { Route, RouteStatus } from '@/modules/fleet.types';
import { useDrivers } from '@/modules/drivers';
import { useVehicles } from '@/modules/vehicles';
import { useAssignDriverToRoute, useAssignVehicleToRoute, useMarkRouteInProgress, useRoutes } from '../hooks';

const routeStatusLabels: Record<RouteStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada',
};

const routeStatusClasses: Record<RouteStatus, string> = {
  pending: 'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-[#3B82F6]',
  completed: 'bg-[#DFF6F1] text-[#0F766E]',
};

export function RoutesPage() {
  const [vehicleRoute, setVehicleRoute] = useState<Route | null>(null);
  const [driverRoute, setDriverRoute] = useState<Route | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const routesQuery = useRoutes();
  const vehiclesQuery = useVehicles();
  const driversQuery = useDrivers();
  const assignVehicle = useAssignVehicleToRoute();
  const assignDriver = useAssignDriverToRoute();
  const markInProgress = useMarkRouteInProgress();
  const { toast } = useToast();

  const availableVehicles = useMemo(
    () => (vehiclesQuery.data ?? []).filter((vehicle) => vehicle.status === 'operational'),
    [vehiclesQuery.data],
  );
  const availableDrivers = useMemo(
    () => (driversQuery.data ?? []).filter((driver) => driver.status === 'available'),
    [driversQuery.data],
  );

  const openVehicleModal = (route: Route) => {
    setVehicleRoute(route);
    setSelectedVehicleId(availableVehicles[0]?.id ?? '');
  };

  const openDriverModal = (route: Route) => {
    setDriverRoute(route);
    setSelectedDriverId(availableDrivers[0]?.id ?? '');
  };

  const handleAssignVehicle = () => {
    if (!vehicleRoute || !selectedVehicleId) {
      return;
    }

    assignVehicle.mutate(
      { routeId: vehicleRoute.id, vehicleId: selectedVehicleId },
      {
        onSuccess: () => {
          setVehicleRoute(null);
          toast({ title: 'Vehiculo asignado a la ruta', type: 'success' });
        },
        onError: () => toast({ title: 'No se pudo asignar el vehiculo', type: 'error' }),
      },
    );
  };

  const handleAssignDriver = () => {
    if (!driverRoute || !selectedDriverId) {
      return;
    }

    assignDriver.mutate(
      { routeId: driverRoute.id, driverId: selectedDriverId },
      {
        onSuccess: () => {
          setDriverRoute(null);
          toast({ title: 'Conductor asignado a la ruta', type: 'success' });
        },
        onError: () => toast({ title: 'No se pudo asignar el conductor', type: 'error' }),
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Gestion de Rutas</h1>
        <p className="mt-2 text-sm text-[#64748B]">Asigna vehiculos, conductores y controla el avance de las rutas.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {routesQuery.isError ? (
          <div className="lg:col-span-3">
            <ApiErrorState onRetry={() => void routesQuery.refetch()} />
          </div>
        ) : routesQuery.isLoading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-56" />)
          : (routesQuery.data ?? []).map((route) => (
              <Card key={route.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DFF6F1] text-[#0F766E]">
                      <RouteIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-950">{route.code}</h2>
                      <p className="mt-1 text-sm text-[#64748B]">{route.ordersCount} ordenes</p>
                    </div>
                  </div>
                  <Badge className={routeStatusClasses[route.status]}>{routeStatusLabels[route.status]}</Badge>
                </div>

                <div className="mt-5 space-y-3 text-sm text-[#64748B]">
                  <RouteInfo icon={<Truck className="h-4 w-4" />} label="Vehiculo asignado" value={route.vehicleAssigned ?? 'Sin asignar'} />
                  <RouteInfo icon={<UserRound className="h-4 w-4" />} label="Conductor asignado" value={route.driverAssigned ?? 'Sin asignar'} />
                  <RouteInfo icon={<MapPinned className="h-4 w-4" />} label="Cantidad de ordenes" value={String(route.ordersCount)} />
                </div>

                <div className="mt-5 grid gap-2">
                  <Button variant="secondary" onClick={() => openVehicleModal(route)}>
                    Asignar vehiculo
                  </Button>
                  <Button variant="secondary" onClick={() => openDriverModal(route)}>
                    Asignar conductor
                  </Button>
                  <Button disabled={route.status !== 'pending' || markInProgress.isPending} onClick={() => handleStartRoute(route.id)}>
                    <Play className="h-4 w-4" />
                    Iniciar ruta
                  </Button>
                </div>
              </Card>
            ))}
      </div>

      {!routesQuery.isLoading && !routesQuery.isError && (routesQuery.data ?? []).length === 0 ? (
        <Card className="p-10 text-center text-sm text-[#64748B]">No hay rutas registradas.</Card>
      ) : null}

      <Dialog open={Boolean(vehicleRoute)} title="Asignar vehiculo a ruta" onClose={() => setVehicleRoute(null)}>
        <div className="space-y-4">
          <Select value={selectedVehicleId} onChange={(event) => setSelectedVehicleId(event.target.value)} className="w-full">
            {availableVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setVehicleRoute(null)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignVehicle} disabled={!selectedVehicleId || assignVehicle.isPending}>
              Asignar vehiculo
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={Boolean(driverRoute)} title="Asignar conductor a ruta" onClose={() => setDriverRoute(null)}>
        <div className="space-y-4">
          <Select value={selectedDriverId} onChange={(event) => setSelectedDriverId(event.target.value)} className="w-full">
            {availableDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.license}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDriverRoute(null)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignDriver} disabled={!selectedDriverId || assignDriver.isPending}>
              Asignar conductor
            </Button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}

type RouteInfoProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function RouteInfo({ icon, label, value }: RouteInfoProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-slate-950">{value}</span>
    </div>
  );
}
