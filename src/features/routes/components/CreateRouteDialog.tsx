import { useState } from 'react';
import { Dialog, Button, Input } from '@/components/ui';
import type { CreateRoutePayload } from '../types';
import { validateCreateRoute } from '../validations';

type CreateRouteDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRoutePayload) => void;
};

export function CreateRouteDialog({ open, isSubmitting, onClose, onSubmit }: CreateRouteDialogProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const payload = { title: title.trim() };
    const validationError = validateCreateRoute(payload);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(payload);
    setTitle('');
  };

  return (
    <Dialog open={open} title="Crear ruta" onClose={onClose}>
      <div className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titulo de la ruta" maxLength={50} />
        {error ? <p className="text-sm font-medium text-[#EF4444]">{error}</p> : null}
        <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Crear ruta
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
