import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, XCircle } from 'lucide-react';
import { Button, Card, Skeleton } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import {
  CategoryBadge,
  DeleteDialog,
  EditTicketModal,
  PriorityBadge,
  StatusBadge,
  TicketTimeline,
} from '../components';
import { useTicketById, useUpdateTicket, useUsers } from '../hooks';
import { formatDate } from '../utils';
import { useToast } from '@/components/ui';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const ticketQuery = useTicketById(id);
  const usersQuery = useUsers();
  const updateTicket = useUpdateTicket();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

  const resolveUserName = (userId: string | null) => {
    if (!userId) return 'Sin asignar';
    const found = users.find((u) => u.id === userId);
    return found ? found.name : userId;
  };

  if (ticketQuery.isLoading) {
    return (
      <section className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/support')} className="h-8">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <Skeleton className="h-64" />
      </section>
    );
  }

  if (ticketQuery.isError || !ticketQuery.data) {
    return (
      <section className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/support')} className="h-8">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <ApiErrorState
          title="No fue posible obtener el ticket."
          message="Verifica que el ticket exista y que el microservicio de soporte esté disponible."
          onRetry={() => void ticketQuery.refetch()}
        />
      </section>
    );
  }

  const ticket = ticketQuery.data;

  const handleClose = () => {
    updateTicket.mutate(
      { id: ticket.id, payload: { ...ticket, status: 'CLOSED', assignedTo: ticket.assignedTo } },
      {
        onSuccess: () => toast({ title: 'Ticket cerrado correctamente.', type: 'success' }),
        onError: () => toast({ title: 'No se pudo cerrar el ticket.', type: 'error' }),
      },
    );
  };

  const handleDeleted = () => {
    navigate('/support');
  };

  return (
    <section className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/support')} className="h-8">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Button>

      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={ticket.category} />
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">{ticket.title}</h1>
            <p className="text-sm text-[#64748B]">{ticket.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" /> Editar
            </Button>
            <Button variant="secondary" onClick={handleClose} disabled={updateTicket.isPending}>
              <XCircle className="h-4 w-4" /> Cerrar Ticket
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" /> Eliminar
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">Información</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <InfoRow label="ID" value={ticket.id} mono />
            <InfoRow label="Usuario creador" value={resolveUserName(ticket.userId)} />
            <InfoRow label="Administrador asignado" value={resolveUserName(ticket.assignedTo)} />
            <InfoRow label="Fecha de creación" value={formatDate(ticket.createdAt)} />
            <InfoRow label="Última actualización" value={formatDate(ticket.updatedAt)} />
          </dl>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">Progreso del ticket</h2>
          <div className="mt-6">
            <TicketTimeline status={ticket.status} />
          </div>
        </Card>
      </div>

      <EditTicketModal open={editOpen} ticket={ticket} onClose={() => setEditOpen(false)} />
      <DeleteDialog
        open={deleteOpen}
        ticket={ticket}
        onClose={() => setDeleteOpen(false)}
        onDeleted={handleDeleted}
      />
    </section>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-[#64748B]">{label}</dt>
      <dd className={mono ? 'text-right font-mono text-xs text-slate-900' : 'text-right font-medium text-slate-900'}>
        {value}
      </dd>
    </div>
  );
}