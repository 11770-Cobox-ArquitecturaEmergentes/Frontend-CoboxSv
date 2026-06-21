import { useState, useEffect } from 'react';
import { Button, Dialog } from '@/components/ui';
import type { VehicleStatus } from '@/modules/fleet.types';

type ChangeStatusDialogProps = {
  open: boolean;
  vehicleId: string;
  currentStatus: VehicleStatus;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (status: VehicleStatus, reason: string) => void;
};

export function ChangeStatusDialog({
  open,
  vehicleId,
  currentStatus,
  isSubmitting,
  onClose,
  onSubmit,
}: ChangeStatusDialogProps) {
  const [status, setStatus] = useState<VehicleStatus>(currentStatus);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      setReason('');
      setError(null);
    }
  }, [currentStatus, open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reason.trim()) {
      setError('El motivo del cambio de estado es obligatorio');
      return;
    }

    setError(null);
    onSubmit(status, reason.trim());
  };

  return (
    <Dialog open={open} title={`Cambiar Estado de Unidad #${vehicleId}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm font-medium text-[#DC2626] bg-red-50 p-2.5 rounded-lg">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-slate-700">Nuevo Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as VehicleStatus)}
            className="mt-1 block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          >
            <option value="operational">Operativo (AVAILABLE)</option>
            <option value="maintenance">Mantenimiento (MAINTENANCE)</option>
            <option value="out_of_service">Fuera de servicio (INACTIVE)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Motivo del Cambio</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Especifica el motivo de la transición (ej. Falla en frenos, inspección rutinaria de 20k km, mantenimiento completado)..."
            className="mt-1 block w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none min-h-[80px]"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Confirmar Cambio'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
