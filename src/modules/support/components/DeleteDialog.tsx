import { Dialog, Button } from '@/components/ui';
import { useToast } from '@/components/ui';
import { useDeleteTicket } from '../hooks';
import type { Ticket } from '../types';

type DeleteDialogProps = {
  open: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onDeleted?: () => void;
};

export function DeleteDialog({ open, ticket, onClose, onDeleted }: DeleteDialogProps) {
  const { toast } = useToast();
  const deleteTicket = useDeleteTicket();

  const handleConfirm = () => {
    if (!ticket) return;
    deleteTicket.mutate(ticket.id, {
      onSuccess: () => {
        toast({ title: 'Ticket eliminado correctamente.', type: 'success' });
        onDeleted?.();
        onClose();
      },
      onError: () => {
        toast({ title: 'No se pudo eliminar el ticket.', type: 'error' });
      },
    });
  };

  return (
    <Dialog open={open} title="Eliminar Ticket" onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm text-[#64748B]">¿Está seguro que desea eliminar este ticket?</p>
        {ticket ? (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">
            {ticket.title}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={deleteTicket.isPending}>
            Cancelar
          </Button>
          <Button variant="danger" type="button" onClick={handleConfirm} disabled={deleteTicket.isPending}>
            {deleteTicket.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}