import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/components/ui';
import { Button, Input, Select } from '@/components/ui';
import { useToast } from '@/components/ui';
import { useCreateTicket } from '../hooks';
import { createTicketSchema } from '../schemas';
import type { CreateTicketFormValues } from '../schemas';
import { categoryOptions, priorityOptions } from '../constants';

type CreateTicketModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateTicketModal({ open, onClose }: CreateTicketModalProps) {
  const { toast } = useToast();
  const createTicket = useCreateTicket();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'LOGIN',
      priority: 'MEDIUM',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: CreateTicketFormValues) => {
    createTicket.mutate(values, {
      onSuccess: () => {
        toast({ title: 'Ticket creado correctamente.', type: 'success' });
        handleClose();
      },
      onError: () => {
        toast({ title: 'No se pudo crear el ticket.', type: 'error' });
      },
    });
  };

  return (
    <Dialog open={open} title="Nuevo Ticket" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block space-y-1 text-sm font-medium text-slate-700">
          Título
          <Input placeholder="Ej: Error al iniciar sesión" {...register('title')} />
          {errors.title ? <p className="text-xs font-medium text-[#EF4444]">{errors.title.message}</p> : null}
        </label>

        <label className="block space-y-1 text-sm font-medium text-slate-700">
          Descripción
          <textarea
            {...register('description')}
            placeholder="Describe el problema con detalle..."
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
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="block space-y-1 text-sm font-medium text-slate-700">
            Prioridad
            <Select {...register('priority')}>
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || createTicket.isPending}>
            {createTicket.isPending ? 'Creando...' : 'Crear Ticket'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}