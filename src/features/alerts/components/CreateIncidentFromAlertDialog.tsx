import { Button, Dialog } from '@/components/ui';

type CreateIncidentFromAlertDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  alreadyLinked: boolean;
  linkedIncidentId?: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function CreateIncidentFromAlertDialog({
  open,
  isSubmitting,
  alreadyLinked,
  linkedIncidentId,
  onClose,
  onConfirm,
}: CreateIncidentFromAlertDialogProps) {
  const primaryLabel =
    alreadyLinked && linkedIncidentId
      ? 'Ir al incidente'
      : 'Crear incidente';

  return (
    <Dialog
      open={open}
      title="Crear incidente desde alerta"
      onClose={onClose}
    >
      <div className="space-y-6">
        <p className="text-sm text-slate-700">
          {alreadyLinked && linkedIncidentId
            ? `Ya existe un incidente vinculado (ID: ${linkedIncidentId}). Se abrirá el incidente existente.`
            : 'Se creará un incidente a partir de esta alerta. El incidente quedará vinculado a la alerta para su seguimiento.'}
        </p>

        <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : primaryLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}