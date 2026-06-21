import { useState } from 'react';
import { Button, Dialog, Input } from '@/components/ui';
import type { IncidentType, IncidentSeverity, CreateIncidentPayload } from '../types';

type CreateIncidentDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateIncidentPayload) => void;
};

export function CreateIncidentDialog({ open, isSubmitting, onClose, onSubmit }: CreateIncidentDialogProps) {
  const [serviceReference, setServiceReference] = useState('');
  const [reporterReference, setReporterReference] = useState('Conductor Central');
  const [type, setType] = useState<IncidentType>('DELIVERY_ISSUE');
  const [severity, setSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!serviceReference.trim()) {
      setError('El ID del servicio/orden es obligatorio');
      return;
    }
    if (!description.trim()) {
      setError('La descripción del incidente es obligatoria');
      return;
    }
    if (!location.trim()) {
      setError('La ubicación del incidente es obligatoria');
      return;
    }

    setError(null);
    onSubmit({
      serviceReference: serviceReference.trim(),
      reporterReference: reporterReference.trim(),
      type,
      severity,
      description: description.trim(),
      location: location.trim(),
    });
  };

  return (
    <Dialog open={open} title="Reportar Nueva Incidencia" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm font-medium text-[#DC2626] bg-red-50 p-2.5 rounded-lg">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Orden / Servicio Relacionado (ID)</label>
            <Input
              value={serviceReference}
              onChange={(e) => setServiceReference(e.target.value)}
              placeholder="Ej. 1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Conductor Reportante</label>
            <Input
              value={reporterReference}
              onChange={(e) => setReporterReference(e.target.value)}
              placeholder="Ej. Conductor #1"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Tipo de Incidencia</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as IncidentType)}
              className="mt-1 block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            >
              <option value="ACCIDENT">Accidente</option>
              <option value="BREAKDOWN">Avería Mecánica</option>
              <option value="ROAD_BLOCK">Bloqueo de Vía</option>
              <option value="DELIVERY_ISSUE">Problema de Entrega</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Severidad</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
              className="mt-1 block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            >
              <option value="LOW">Baja (LOW)</option>
              <option value="MEDIUM">Media (MEDIUM)</option>
              <option value="HIGH">Alta (HIGH)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Ubicación</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. Av. Larco 450, Miraflores"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Descripción detallada</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Especifica detalladamente lo sucedido..."
            className="mt-1 block w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none min-h-[80px]"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Reportando...' : 'Reportar Incidente'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
