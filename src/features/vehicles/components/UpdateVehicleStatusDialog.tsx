import { Button, Dialog, Select } from '@/components/ui';
import type { UpdateVehicleStatusPayload, Vehicle } from '../types';
import { vehicleStatusLabels } from './VehicleStatusBadge';

type UpdateVehicleStatusDialogProps = {
  open: boolean;
  vehicle: Vehicle | null;
  selectedStatus: UpdateVehicleStatusPayload['vehicleStatus'] | '';
  isSubmitting: boolean;
  onSelectedStatusChange: (status: UpdateVehicleStatusPayload['vehicleStatus'] | '') => void;
  onClose: () => void;
  onSubmit: () => void;
};

const allowedStatuses: UpdateVehicleStatusPayload['vehicleStatus'][] = [
  'OPERATIONAL',
  'IN_MAINTENANCE',
  'OUT_OF_SERVICE',
];

export function UpdateVehicleStatusDialog({
  open,
  vehicle,
  selectedStatus,
  isSubmitting,
  onSelectedStatusChange,
  onClose,
  onSubmit,
}: UpdateVehicleStatusDialogProps) {
  return (
    <Dialog open={open} title="Cambiar estado de vehiculo" onClose={onClose}>
      <div className="space-y-4">
        {vehicle ? (
          <p className="text-sm text-slate-500">
            Vehiculo: {vehicle.plateNumber} · Estado actual: {vehicleStatusLabels[vehicle.status]}
          </p>
        ) : null}
        <Select
          value={selectedStatus}
          onChange={(event) => onSelectedStatusChange(event.target.value as UpdateVehicleStatusPayload['vehicleStatus'] | '')}
          className="w-full"
        >
          <option value="">Selecciona un estado</option>
          {allowedStatuses.map((status) => (
            <option key={status} value={status}>
              {vehicleStatusLabels[status]}
            </option>
          ))}
        </Select>
        <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={!vehicle || !selectedStatus || isSubmitting}>
            Cambiar estado
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
