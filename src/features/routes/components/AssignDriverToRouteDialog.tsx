import { Dialog, Button, Select } from '@/components/ui';
import type { Driver } from '@/features/drivers/types';
import type { Route } from '../types';

type AssignDriverToRouteDialogProps = {
  open: boolean;
  route: Route | null;
  routes?: Route[];
  selectedRouteId?: string;
  drivers: Driver[];
  selectedDriverId: string;
  isSubmitting: boolean;
  fixedDriverLabel?: string;
  onSelectedRouteChange?: (routeId: string) => void;
  onSelectedDriverChange: (driverId: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function AssignDriverToRouteDialog({
  open,
  route,
  routes,
  selectedRouteId,
  drivers,
  selectedDriverId,
  isSubmitting,
  fixedDriverLabel,
  onSelectedRouteChange,
  onSelectedDriverChange,
  onClose,
  onSubmit,
}: AssignDriverToRouteDialogProps) {
  const effectiveRoute = route ?? routes?.find((candidate) => candidate.id === selectedRouteId) ?? null;

  return (
    <Dialog open={open} title="Asignar conductor a ruta" onClose={onClose}>
      <div className="space-y-4">
        {routes ? (
          routes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No hay rutas candidatas para asignar.
            </div>
          ) : (
            <Select value={selectedRouteId ?? ''} onChange={(event) => onSelectedRouteChange?.(event.target.value)} className="w-full">
              <option value="">Selecciona una ruta</option>
              {routes.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.title} - Ruta #{candidate.id}
                </option>
              ))}
            </Select>
          )
        ) : route ? (
          <p className="text-sm text-slate-500">Ruta: {route.title}</p>
        ) : null}
        {fixedDriverLabel ? (
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{fixedDriverLabel}</div>
        ) : drivers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            No hay conductores disponibles.
          </div>
        ) : (
          <Select value={selectedDriverId} onChange={(event) => onSelectedDriverChange(event.target.value)} className="w-full">
            <option value="">Selecciona un conductor</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.email} - {driver.licenceNumber}
              </option>
            ))}
          </Select>
        )}
        <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={!effectiveRoute || !selectedDriverId || isSubmitting}>
            Asignar conductor
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
