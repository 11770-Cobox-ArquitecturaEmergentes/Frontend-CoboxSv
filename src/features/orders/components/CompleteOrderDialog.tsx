import { useState, useEffect } from 'react';
import { Button, Dialog, Input } from '@/components/ui';
import type { Route } from '@/modules/fleet.types';

type CompleteOrderDialogProps = {
  open: boolean;
  assignedRouteId?: string;
  routes: Route[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { routeId: number; photoUrl: string; receiverName: string; signatureData: string }) => void;
};

export function CompleteOrderDialog({
  open,
  assignedRouteId,
  routes,
  isSubmitting,
  onClose,
  onSubmit,
}: CompleteOrderDialogProps) {
  const [routeId, setRouteId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600');
  const [signatureData, setSignatureData] = useState('Firma Digital CoBox Logística');
  const [error, setError] = useState<string | null>(null);

  // Sync with assignedRouteId if provided
  useEffect(() => {
    if (assignedRouteId) {
      setRouteId(assignedRouteId);
    } else {
      setRouteId('');
    }
  }, [assignedRouteId, open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!routeId) {
      setError('Debe seleccionar o ingresar una ruta asociada');
      return;
    }
    if (!receiverName.trim()) {
      setError('El nombre del receptor es obligatorio');
      return;
    }

    onSubmit({
      routeId: Number(routeId),
      photoUrl,
      receiverName,
      signatureData,
    });
  };

  return (
    <Dialog open={open} title="Finalizar y Entregar Orden" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm font-medium text-[#DC2626]">{error}</p>}
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Ruta Asociada</label>
          <select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          >
            <option value="">Seleccione una ruta</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code} ({r.status === 'in_progress' ? 'En progreso' : r.status === 'pending' ? 'Pendiente' : 'Completada'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Nombre de quien recibe</label>
          <Input
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="Ej. Juan Carlos Pérez"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Evidencia (Foto URL)</label>
          <Input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Datos de Firma</label>
          <Input
            value={signatureData}
            onChange={(e) => setSignatureData(e.target.value)}
            placeholder="Ej. Firma digital Cobox"
            className="mt-1"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : 'Completar Entrega'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
