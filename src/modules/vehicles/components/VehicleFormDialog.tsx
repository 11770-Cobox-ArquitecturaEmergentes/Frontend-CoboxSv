import { useState } from 'react';
import { Dialog, Button, Input, Select } from '@/components/ui';
import { vehicleSchema } from '../schemas/vehicle.schema';
import type { CreateVehiclePayload, Vehicle } from '@/modules/fleet.types';

type VehicleFormDialogProps = {
  open: boolean;
  initialVehicle?: Vehicle | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVehiclePayload) => void;
};

const emptyVehicle: CreateVehiclePayload = {
  plate: '',
  type: '',
  capacity: 0,
  status: 'operational',
  year: new Date().getFullYear(),
  brand: '',
  model: '',
};

export function VehicleFormDialog({ open, initialVehicle, isSubmitting, onClose, onSubmit }: VehicleFormDialogProps) {
  const [form, setForm] = useState<CreateVehiclePayload>(initialVehicle ?? emptyVehicle);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof CreateVehiclePayload, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === 'capacity' || field === 'year' ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    const result = vehicleSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Formulario invalido');
      return;
    }

    setError(null);
    onSubmit(result.data);
  };

  return (
    <Dialog open={open} title={initialVehicle ? 'Editar vehiculo' : 'Agregar vehiculo'} onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Matricula
          <Input value={form.plate} onChange={(event) => updateField('plate', event.target.value)} />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Tipo de vehiculo
          <Input value={form.type} onChange={(event) => updateField('type', event.target.value)} />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Capacidad
          <Input type="number" value={form.capacity} onChange={(event) => updateField('capacity', event.target.value)} />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Estado
          <Select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
            <option value="operational">Operativo</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="out_of_service">Fuera de servicio</option>
          </Select>
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Año
          <Input type="number" value={form.year} onChange={(event) => updateField('year', event.target.value)} />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Marca
          <Input value={form.brand} onChange={(event) => updateField('brand', event.target.value)} />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
          Modelo
          <Input value={form.model} onChange={(event) => updateField('model', event.target.value)} />
        </label>
      </div>
      {error ? <p className="mt-4 text-sm font-medium text-[#EF4444]">{error}</p> : null}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          Agregar vehiculo
        </Button>
      </div>
    </Dialog>
  );
}
