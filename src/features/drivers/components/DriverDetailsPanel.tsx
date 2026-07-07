import { useMemo, useState } from 'react';
import { ClipboardList, Route, UserRound, X } from 'lucide-react';
import { isAxiosError } from 'axios';
import { ApiErrorState } from '@/components/shared';
import { Button, Card, Skeleton, useToast } from '@/components/ui';
import { AssignDriverToRouteDialog } from '@/features/routes/components';
import { useAssignDriverToRoute, useRoutes } from '@/features/routes/hooks';
import { validatePositiveId } from '@/features/routes/validations';
import { useDriver, useDriverRoutes } from '../hooks';
import type { DriverRoute } from '../types';
import { DriverStatusBadge } from './DriverCard';

type DriverDetailsPanelProps = {
  driverId: string;
  onClose: () => void;
};

const routeStatusLabels: Record<DriverRoute['status'], string> = {
  PLANNED: 'Planificada',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
};

function PanelSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28" />
      <Skeleton className="h-48" />
    </div>
  );
}

function EmptyPanelSection({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

function DriverRoutesList({ routes }: { routes: DriverRoute[] }) {
  if (routes.length === 0) return <EmptyPanelSection message="Este conductor no tiene rutas asignadas." />;

  return (
    <div className="divide-y divide-slate-100">
      {routes.map((route) => (
        <div key={route.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
            <Route className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-950">{route.title}</p>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {routeStatusLabels[route.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Vehiculo #{route.vehicleId ?? '-'} · {route.finishedOrderIds.length}/{route.orderIds.length} ordenes finalizadas
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DriverDetailsPanel({ driverId, onClose }: DriverDetailsPanelProps) {
  const [isAssignRouteOpen, setIsAssignRouteOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const driverQuery = useDriver(driverId);
  const routesQuery = useDriverRoutes(driverId);
  const allRoutesQuery = useRoutes();
  const assignDriverToRoute = useAssignDriverToRoute();
  const { toast } = useToast();
  const isDriverNotFound = isAxiosError(driverQuery.error) && driverQuery.error.response?.status === 404;
  const assignableRoutes = useMemo(
    () => (allRoutesQuery.data ?? []).filter((route) => route.status === 'PLANNED' && route.driverId !== driverId),
    [allRoutesQuery.data, driverId],
  );

  const openAssignRoute = () => {
    setSelectedRouteId(assignableRoutes[0]?.id ?? '');
    setIsAssignRouteOpen(true);
  };

  const closeAssignRoute = () => {
    setIsAssignRouteOpen(false);
    setSelectedRouteId('');
  };

  const handleAssignRoute = () => {
    if (!selectedRouteId) return;
    const validationError = validatePositiveId(selectedRouteId, 'La ruta');
    if (validationError) {
      toast({ title: validationError, type: 'error' });
      return;
    }
    assignDriverToRoute.mutate(
      { routeId: selectedRouteId, payload: { driverId } },
      {
        onSuccess: () => {
          closeAssignRoute();
          toast({ title: 'Ruta asignada al conductor', type: 'success' });
        },
        onError: () => toast({ title: 'No se pudo asignar la ruta', type: 'error' }),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30">
      <aside className="flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-950">Detalle de conductor</h2>
            <p className="mt-1 text-sm text-slate-500">Conductor #{driverId}</p>
          </div>
          <Button variant="ghost" className="h-9 w-9 shrink-0 px-0" aria-label="Cerrar panel" onClick={onClose}>
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {driverQuery.isLoading ? <PanelSkeleton /> : null}

          {driverQuery.isError ? (
            <ApiErrorState
              title={isDriverNotFound ? 'Conductor no encontrado' : 'No se pudo cargar el conductor'}
              message={isDriverNotFound ? 'El conductor seleccionado ya no existe o no esta disponible.' : undefined}
              onRetry={() => void driverQuery.refetch()}
            />
          ) : null}

          {driverQuery.data ? (
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DFF6F1] text-[#0F766E]">
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-950">Conductor #{driverQuery.data.id}</h3>
                      <DriverStatusBadge status={driverQuery.data.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{driverQuery.data.email}</p>
                    <p className="mt-0.5 text-sm text-slate-500">Licencia {driverQuery.data.licenceNumber}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <ClipboardList className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                    Rutas asignadas
                  </div>
                  <Button
                    variant="secondary"
                    className="h-9 w-full sm:w-auto"
                    disabled={allRoutesQuery.isLoading || assignableRoutes.length === 0}
                    onClick={openAssignRoute}
                  >
                    Asignar ruta
                  </Button>
                </div>

                {routesQuery.isLoading ? <Skeleton className="h-36" /> : null}
                {routesQuery.isError ? (
                  <ApiErrorState title="No se pudieron cargar las rutas" onRetry={() => void routesQuery.refetch()} />
                ) : null}
                {routesQuery.data ? <DriverRoutesList routes={routesQuery.data} /> : null}
              </Card>
            </div>
          ) : null}
        </div>
      </aside>

      {driverQuery.data ? (
        <AssignDriverToRouteDialog
          open={isAssignRouteOpen}
          route={null}
          routes={assignableRoutes}
          selectedRouteId={selectedRouteId}
          drivers={[]}
          selectedDriverId={driverId}
          fixedDriverLabel={`${driverQuery.data.email} - ${driverQuery.data.licenceNumber}`}
          isSubmitting={assignDriverToRoute.isPending}
          onSelectedRouteChange={setSelectedRouteId}
          onSelectedDriverChange={() => undefined}
          onClose={closeAssignRoute}
          onSubmit={handleAssignRoute}
        />
      ) : null}
    </div>
  );
}
