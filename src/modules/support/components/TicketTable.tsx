import type { Ticket, SupportUser } from '../types';
import { TicketMobileCard, TicketRow } from './TicketRow';

type TicketTableProps = {
  tickets: Ticket[];
  users: SupportUser[];
  onView: (ticket: Ticket) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
};

const columns = ['ID', 'Título', 'Categoría', 'Prioridad', 'Estado', 'Actualizado', 'Acciones'];

export function TicketTable({ tickets, users, onView, onEdit, onDelete }: TicketTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-[#E2E8F0] bg-white lg:block">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                users={users}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {tickets.map((ticket) => (
          <TicketMobileCard
            key={ticket.id}
            ticket={ticket}
            users={users}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}