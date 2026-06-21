import { useState } from 'react';
import { Button, Dialog, Input } from '@/components/ui';

type ResolveIncidentDialogProps = {
  open: boolean;
  incidentId: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { type: string; summary: string; responsible: string }) => void;
};

export function ResolveIncidentDialog({
  open,
  incidentId,
  isSubmitting,
  onClose,
  onSubmit,
}: ResolveIncidentDialogProps) {
  const [type, setType] = useState('UNIT_DISPATCH');
  const [summary, setSummary] = useState('');
  const [responsible, setResponsible] = useState('Supervisor Control Cobox');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!summary.trim()) {
      setError('Debes indicar la acción tomada para cerrar la incidencia');
      return;
    }
    if (!responsible.trim()) {
      setError('El responsable del cierre es obligatorio');
      return;
    }

    setError(null);
    onSubmit({
      type,
      summary,
      responsible,
    });
  };

  return (
    <Dialog open={open} title={`Resolver Incidencia #${incidentId}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm font-medium text-[#DC2626] bg-red-50 p-2.5 rounded-lg">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-slate-700">Tipo de Resolución</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          >
            <option value="UNIT_DISPATCH">Despacho de Unidad de Soporte</option>
            <option value="ROUTE_CORRECTION">Corrección de Ruta</option>
            <option value="MECHANICAL_REPAIR">Asistencia Mecánica en Sitio</option>
            <option value="CLIENT_CONTACT">Contacto Directo con Cliente</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Acción Tomada (Detalle)</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Describe las acciones tomadas para dar solución al incidente..."
            className="mt-1 block w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none min-h-[100px]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Responsable de Resolución</label>
          <Input
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            placeholder="Nombre del supervisor"
            className="mt-1"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Resolviendo...' : 'Confirmar Resolución'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
