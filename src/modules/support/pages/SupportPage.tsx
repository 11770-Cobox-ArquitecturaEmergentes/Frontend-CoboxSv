import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertOctagon, Clock, Plus, Ticket as TicketIcon, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import { useTickets, useUsers } from '../hooks';
import {
  CreateTicketModal,
  DeleteDialog,
  EditTicketModal,
  FilterDropdown,
  LoadingSkeleton,
  SearchBar,
  StatisticCard,
  TicketTable,
} from '../components';
import {
  filterCategoryOptions,
  filterPriorityOptions,
  filterStatusOptions,
} from '../constants';
import type { Ticket, TicketCategory, TicketPriority, TicketStatus } from '../types';

export function SupportPage() {
  const navigate = useNavigate();
  const ticketsQuery = useTickets();
  const usersQuery = useUsers();
  const tickets = useMemo(() => ticketsQuery.data ?? [], [ticketsQuery.data]);
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TicketStatus | 'ALL'>('ALL');
  const [priority, setPriority] = useState<TicketPriority | 'ALL'>('ALL');
  const [category, setCategory] = useState<TicketCategory | 'ALL'>('ALL');

  const [createOpen, setCreateOpen] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [deleteTicket, setDeleteTicket] = useState<Ticket | null>(null);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'OPEN').length;
    const inProgress = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
    const critical = tickets.filter((t) => t.priority === 'CRITICAL').length;
    return { total, open, inProgress, critical };
  }, [tickets]);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return tickets.filter((t) => {
      const matchesSearch =
        !normalized ||
        t.title.toLowerCase().includes(normalized) ||
        String(t.id).toLowerCase().includes(normalized) ||
        (t.assignedTo ?? '').toLowerCase().includes(normalized);
      const matchesStatus = status === 'ALL' || t.status === status;
      const matchesPriority = priority === 'ALL' || t.priority === priority;
      const matchesCategory = category === 'ALL' || t.category === category;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, search, status, priority, category]);

  const handleView = (ticket: Ticket) => navigate(`/support/${ticket.id}`);

  if (ticketsQuery.isLoading) {
    return (
      <section className="space-y-6">
        <SupportHeader onCreate={() => setCreateOpen(true)} />
        <LoadingSkeleton />
      </section>
    );
  }

  if (ticketsQuery.isError) {
    return (
      <section className="space-y-6">
        <SupportHeader onCreate={() => setCreateOpen(true)} />
        <ApiErrorState
          title="No fue posible obtener los tickets."
          message="Verifica que el microservicio de soporte esté disponible y que VITE_SUPPORT_API_URL apunte al servicio correcto."
          onRetry={() => void ticketsQuery.refetch()}
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <SupportHeader onCreate={() => setCreateOpen(true)} />

      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      >
        <StatisticCard icon={TicketIcon} value={stats.total} label="Total de Tickets" iconClassName="bg-[#DFF6F1] text-[#0F766E]" />
        <StatisticCard icon={TriangleAlert} value={stats.open} label="Abiertos" iconClassName="bg-blue-50 text-[#3B82F6]" />
        <StatisticCard icon={Clock} value={stats.inProgress} label="En Proceso" iconClassName="bg-orange-50 text-[#F97316]" />
        <StatisticCard icon={AlertOctagon} value={stats.critical} label="Prioridad Crítica" iconClassName="bg-red-50 text-[#EF4444]" />
      </motion.div>

      <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:items-center">
            <FilterDropdown value={status} onChange={setStatus} options={filterStatusOptions} className="md:w-40" />
            <FilterDropdown value={priority} onChange={setPriority} options={filterPriorityOptions} className="md:w-40" />
            <FilterDropdown value={category} onChange={setCategory} options={filterCategoryOptions} className="md:w-48" />
          </div>
          <div className="md:ml-4 md:w-44">
            <p className="text-right text-sm text-[#64748B]">
              <span className="font-semibold text-slate-950">{filtered.length}</span> tickets encontrados
            </p>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyTicketsState onCreate={() => setCreateOpen(true)} />
      ) : (
        <TicketTable
          tickets={filtered}
          users={users}
          onView={handleView}
          onEdit={setEditTicket}
          onDelete={setDeleteTicket}
        />
      )}

      <CreateTicketModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditTicketModal open={Boolean(editTicket)} ticket={editTicket} onClose={() => setEditTicket(null)} />
      <DeleteDialog open={Boolean(deleteTicket)} ticket={deleteTicket} onClose={() => setDeleteTicket(null)} />
    </section>
  );
}

function SupportHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Soporte Técnico</h1>
        <p className="mt-2 text-sm text-[#64748B]">Gestión centralizada de tickets de soporte.</p>
      </div>
      <Button
        onClick={onCreate}
        className="bg-[#16A34A] text-white hover:bg-[#15803D]"
      >
        <Plus className="h-4 w-4" />
        Nuevo Ticket
      </Button>
    </div>
  );
}

function EmptyTicketsState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-[#64748B]">
        <TicketIcon className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">No existen tickets registrados.</h2>
      <p className="max-w-md text-sm text-slate-500">
        Todavía no se ha creado ningún ticket de soporte.
      </p>
      <Button onClick={onCreate} className="mt-2 bg-[#16A34A] text-white hover:bg-[#15803D]">
        <Plus className="h-4 w-4" />
        Crear Ticket
      </Button>
    </div>
  );
}