import { useState } from 'react';
import { Button, Dialog } from '@/components/ui';

type ResolveAlertDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => void;
};

const MIN_NOTES = 5;
const MAX_NOTES = 2000;

export function ResolveAlertDialog({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: ResolveAlertDialogProps) {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = notes.trim();
    if (trimmed.length < MIN_NOTES) {
      setError(
        `Las notas de resolución deben tener al menos ${MIN_NOTES} caracteres`,
      );
      return;
    }
    if (trimmed.length > MAX_NOTES) {
      setError(`Las notas no pueden exceder ${MAX_NOTES} caracteres`);
      return;
    }
    setError(null);
    onSubmit(trimmed);
  };

  const handleClose = () => {
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} title="Resolver alerta" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm font-medium text-[#DC2626] bg-red-50 p-2.5 rounded-lg">
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="resolution-notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notas de resolución
          </label>
          <textarea
            id="resolution-notes"
            placeholder="Describe la acción tomada para resolver esta alerta..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={MAX_NOTES}
            disabled={isSubmitting}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
          />
          <p className="text-xs text-gray-500 mt-1">
            {notes.length}/{MAX_NOTES}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
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