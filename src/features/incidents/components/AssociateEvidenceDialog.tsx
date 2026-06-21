import { useState } from 'react';
import { Button, Dialog, Input } from '@/components/ui';

type AssociateEvidenceDialogProps = {
  open: boolean;
  incidentId: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (evidenceId: string) => void;
};

export function AssociateEvidenceDialog({
  open,
  incidentId,
  isSubmitting,
  onClose,
  onSubmit,
}: AssociateEvidenceDialogProps) {
  const [evidenceId, setEvidenceId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!evidenceId.trim()) {
      setError('El ID de evidencia es obligatorio');
      return;
    }

    setError(null);
    onSubmit(evidenceId.trim());
    setEvidenceId('');
  };

  return (
    <Dialog open={open} title={`Asociar Evidencia a Incidencia #${incidentId}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm font-medium text-[#DC2626] bg-red-50 p-2.5 rounded-lg">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-slate-700">Código/ID de Evidencia</label>
          <Input
            value={evidenceId}
            onChange={(e) => setEvidenceId(e.target.value)}
            placeholder="Ej. EVID-104"
            className="mt-1"
            required
          />
          <p className="mt-1.5 text-xs text-[#64748B]">
            Enlaza este incidente con un registro del módulo Evidence Management.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Vinculando...' : 'Asociar Evidencia'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
