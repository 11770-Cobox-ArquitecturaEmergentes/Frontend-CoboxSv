import { Package, Truck, X } from 'lucide-react';
import { isAxiosError } from 'axios';
import { ApiErrorState } from '@/components/shared';
import { Button, Card, Skeleton } from '@/components/ui';
import { useVehicle } from '../hooks';
import type { Vehicle } from '../types';
import { VehicleStatusBadge } from './VehicleStatusBadge';

type VehicleDetailsPanelProps = {
  vehicleId: string;
  onClose: () => void;
  onChangeStatus: (vehicle: Vehicle) => void;
};

function formatCapacity(value: number) {
  return `${value.toLocaleString('es-PE')} kg`;
}

function PanelSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28" />
      <Skeleton className="h-36" />
    </div>
  );
}

export function VehicleDetailsPanel({ vehicleId, onClose, onChangeStatus }: VehicleDetailsPanelProps) {
  const vehicleQuery = useVehicle(vehicleId);
  const vehicle = vehicleQuery.data;
  const isNotFound = isAxiosError(vehicleQuery.error) && vehicleQuery.error.response?.status === 404;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30">
      <aside className="flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-950">Detalle de vehiculo</h2>
            <p className="mt-1 text-sm text-slate-500">Vehiculo #{vehicleId}</p>
          </div>
          <Button variant="ghost" className="h-9 w-9 shrink-0 px-0" aria-label="Cerrar panel" onClick={onClose}>
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {vehicleQuery.isLoading ? <PanelSkeleton /> : null}

          {vehicleQuery.isError ? (
            <ApiErrorState
              title={isNotFound ? 'Vehiculo no encontrado' : 'No se pudo cargar el vehiculo'}
              message={isNotFound ? 'El vehiculo seleccionado ya no existe o no esta disponible.' : undefined}
              onRetry={() => void vehicleQuery.refetch()}
            />
          ) : null}

          {vehicle ? (
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DFF6F1] text-[#0F766E]">
                    <Truck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-950">{vehicle.plateNumber}</h3>
                      <VehicleStatusBadge status={vehicle.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Capacidad: {formatCapacity(vehicle.capacityKg)}</p>
                  </div>
                </div>
              </Card>

              <Card className="grid gap-4 p-4 sm:grid-cols-2">
                <div>
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                    <Truck className="h-4 w-4" aria-hidden="true" />
                    Placa
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-950">{vehicle.plateNumber}</p>
                </div>
                <div>
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                    <Package className="h-4 w-4" aria-hidden="true" />
                    Capacidad
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-950">{formatCapacity(vehicle.capacityKg)}</p>
                </div>
              </Card>

              <Button className="w-full" disabled={vehicle.status === 'ON_ROUTE'} onClick={() => onChangeStatus(vehicle)}>
                Cambiar estado
              </Button>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
