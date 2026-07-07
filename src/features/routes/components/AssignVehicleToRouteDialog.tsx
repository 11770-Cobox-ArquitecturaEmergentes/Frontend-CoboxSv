import { Dialog, Button, Select } from '@/components/ui';
import { useVehicles } from '@/modules/vehicles';
import type { Route } from '../types';

type AssignVehicleToRouteDialogProps = {
  open: boolean;
  route: Route | null;
  selectedVehicleId: string;
  isSubmitting: boolean;
  onSelectedVehicleChange: (vehicleId: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function AssignVehicleToRouteDialog({
  open,
  route,
  selectedVehicleId,
  isSubmitting,
  onSelectedVehicleChange,
  onClose,
  onSubmit,
}: AssignVehicleToRouteDialogProps) {
  const vehiclesQuery = useVehicles();
  const vehicles = vehiclesQuery.data ?? [];

  return (
    <Dialog open={open} title="Asignar vehiculo a ruta" onClose={onClose}>
      <div className="space-y-4">
        {route ? <p className="text-sm text-slate-500">Ruta: {route.title}</p> : null}
        {vehicles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            No hay vehiculos disponibles.
          </div>
        ) : (
          <Select value={selectedVehicleId} onChange={(event) => onSelectedVehicleChange(event.target.value)} className="w-full">
            <option value="">Selecciona un vehiculo</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate} ({vehicle.capacity.toLocaleString('es-PE')} kg)
              </option>
            ))}
          </Select>
        )}
        <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={!route || !selectedVehicleId || isSubmitting || vehiclesQuery.isLoading}>
            Asignar vehiculo
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
