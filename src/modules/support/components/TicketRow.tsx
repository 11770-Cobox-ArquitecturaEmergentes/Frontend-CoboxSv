import { Eye, Pencil, Trash2, UserRound } from 'lucide-react';
import type { Ticket, SupportUser } from '../types';
import { CategoryBadge, PriorityBadge, StatusBadge } from '.';
import { formatDate } from '../utils';
import { Button } from '@/components/ui';

type TicketRowProps = {
  ticket: Ticket;
  users: SupportUser[];
  onView: (ticket: Ticket) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
};

function resolveUserName(users: SupportUser[], id: string | null): string {
  if (!id) return 'Sin asignar';
  const found = users.find((user) => user.id === id);
  return found ? found.name : id;
}

export function TicketRow({ ticket, users, onView, onEdit, onDelete }: TicketRowProps) {
  const assignedName = resolveUserName(users, ticket.assignedTo);

  return (
    <tr className="border-t border-[#E2E8F0] transition-colors hover:bg-slate-50">
      <td className="px-4 py-3 align-top">
        <span className="font-mono text-xs text-[#64748B]">{ticket.id.slice(0, 8)}…</span>
      </td>
      <td className="px-4 py-3 align-top">
        <p className="font-semibold text-slate-950">{ticket.title}</p>
        <div className="mt-1 flex items-center gap-1 text-xs text-[#64748B]">
          <UserRound className="h-3 w-3" />
          <span>{assignedName}</span>
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <CategoryBadge category={ticket.category} />
      </td>
      <td className="px-4 py-3 align-top">
        <PriorityBadge priority={ticket.priority} />
      </td>
      <td className="px-4 py-3 align-top">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="px-4 py-3 align-top">
        <span className="text-sm text-[#64748B]">{formatDate(ticket.updatedAt)}</span>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-1">
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onView(ticket)} aria-label="Ver">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onEdit(ticket)} aria-label="Editar">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="danger" className="h-8 w-8 p-0" onClick={() => onDelete(ticket)} aria-label="Eliminar">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function TicketMobileCard({ ticket, users, onView, onEdit, onDelete }: TicketRowProps) {
  const assignedName = resolveUserName(users, ticket.assignedTo);
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[#64748B]">{ticket.id.slice(0, 8)}…</span>
        <CategoryBadge category={ticket.category} />
      </div>
      <p className="mt-2 font-semibold text-slate-950">{ticket.title}</p>
      <div className="mt-1 flex items-center gap-1 text-xs text-[#64748B]">
        <UserRound className="h-3 w-3" />
        <span>{assignedName}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
      </div>
      <p className="mt-2 text-xs text-[#64748B]">Actualizado: {formatDate(ticket.updatedAt)}</p>
      <div className="mt-3 flex items-center gap-2">
        <Button variant="secondary" className="h-8 flex-1" onClick={() => onView(ticket)}>
          <Eye className="h-4 w-4" /> Ver
        </Button>
        <Button variant="secondary" className="h-8 flex-1" onClick={() => onEdit(ticket)}>
          <Pencil className="h-4 w-4" /> Editar
        </Button>
        <Button variant="danger" className="h-8 flex-1" onClick={() => onDelete(ticket)}>
          <Trash2 className="h-4 w-4" /> Eliminar
        </Button>
      </div>
    </div>
  );
}