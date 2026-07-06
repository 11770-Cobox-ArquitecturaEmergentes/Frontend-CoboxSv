import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Button, Input, Select } from '@/components/ui';
import { useToast } from '@/components/ui';
import { useUpdateTicket, useUsers } from '../hooks';
import { updateTicketSchema } from '../schemas';
import type { UpdateTicketFormValues } from '../schemas';
import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from '../constants';
import type { Ticket } from '../types';

type EditTicketModalProps = {
  open: boolean;
  ticket: Ticket | null;
  onClose: () => void;
};

export function EditTicketModal({ open, ticket, onClose }: EditTicketModalProps) {
  const { toast } = useToast();
  const updateTicket = useUpdateTicket();
  const usersQuery = useUsers();
  const users = usersQuery.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTicketFormValues>({
    resolver: zodResolver(updateTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'LOGIN',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedTo: null,
    },
  });

  useEffect(() => {
    if (ticket) {
      reset({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo ?? '',
      });
    }
  }, [ticket, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: UpdateTicketFormValues) => {
    if (!ticket) return;
    const payload = {
      ...values,
      assignedTo: values.assignedTo === '' ? null : values.assignedTo,
    };
    updateTicket.mutate(
      { id: ticket.id, payload },
      {
        onSuccess: () => {
          toast({ title: 'Ticket actualizado correctamente.', type: 'success' });
          handleClose();
        },
        onError: () => {
          toast({ title: 'No se pudo actualizar el ticket.', type: 'error' });
        },
      },
    );
  };

  return (
    <Dialog open={open} title="Editar Ticket" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block space-y-1 text-sm font-medium text-slate-700">
          Título
          <Input {...register('title')} />
          {errors.title ? <p className="text-xs font-medium text-[#EF4444]">{errors.title.message}</p> : null}
        </label>

        <label className="block space-y-1 text-sm font-medium text-slate-700">
          Descripción
          <textarea
            {...register('description')}
            rows={4}
            className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#DFF6F1]"
          />
          {errors.description ? (
            <p className="text-xs font-medium text-[#EF4444]">{errors.description.message}</p>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm font-medium text-slate-700">
            Categoría
            <Select {...register('category')}>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </label>
          <label className="block space-y-1 text-sm font-medium text-slate-700">
            Prioridad
            <Select {...register('priority')}>
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </label>
          <label className="block space-y-1 text-sm font-medium text-slate-700">
            Estado
            <Select {...register('status')}>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </label>
          <label className="block space-y-1 text-sm font-medium text-slate-700">
            Administrador asignado
            <Select {...register('assignedTo')} defaultValue="">
              <option value="">Sin asignar</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </Select>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || updateTicket.isPending}>
            {updateTicket.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}