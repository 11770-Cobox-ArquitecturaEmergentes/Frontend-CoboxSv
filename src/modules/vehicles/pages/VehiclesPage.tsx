import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit2, Eye, Package, Plus, Search, Trash2, TrendingUp, Truck, Wrench } from 'lucide-react';
import { Badge, Button, Card, Input, Select, Skeleton, useToast } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import type { CreateVehiclePayload, Vehicle, VehicleStatus } from '@/modules/fleet.types';
import { useCreateVehicle, useVehicles } from '../hooks';
import { VehicleFormDialog, VehicleStatusBadge } from '../components';

const columnHelper = createColumnHelper<Vehicle>();

const statusLabels: Record<VehicleStatus, string> = {
  operational: 'Operativo',
  maintenance: 'Mantenimiento',
  out_of_service: 'Fuera de servicio',
};

function formatCapacity(value: number) {
  return `${value.toLocaleString('es-PE')} kg`;
}

export function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VehicleStatus>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();
  const vehiclesQuery = useVehicles();
  const createVehicle = useCreateVehicle();

  const vehicles = useMemo(() => vehiclesQuery.data ?? [], [vehiclesQuery.data]);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.plate.toLowerCase().includes(normalizedSearch) ||
        vehicle.type.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, vehicles]);

  const metrics = useMemo(() => {
    const operational = vehicles.filter((vehicle) => vehicle.status === 'operational');
    const maintenance = vehicles.filter((vehicle) => vehicle.status === 'maintenance');
    const availableCapacity = operational.reduce((sum, vehicle) => sum + vehicle.capacity, 0);

    return {
      total: vehicles.length,
      operational: operational.length,
      maintenance: maintenance.length,
      capacity: `${(availableCapacity / 1000).toLocaleString('es-PE')}t`,
    };
  }, [vehicles]);

  const handleSubmit = (payload: CreateVehiclePayload) => {
    createVehicle.mutate(payload, {
      onSuccess: () => {
        setIsFormOpen(false);
        toast({ title: 'Vehiculo agregado correctamente', type: 'success' });
      },
      onError: () => {
        toast({ title: 'No se pudo agregar el vehiculo', type: 'error' });
      },
    });
  };

  const handleDelete = useCallback((vehicle: Vehicle) => {
    if (window.confirm(`¿Eliminar el vehiculo ${vehicle.plate}?`)) {
      toast({ title: 'Eliminacion confirmada localmente', type: 'success' });
    }
  }, [toast]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('plate', {
        header: 'Matricula',
        cell: (info) => <span className="font-semibold text-slate-950">{info.getValue()}</span>,
      }),
      columnHelper.accessor('type', {
        header: 'Tipo',
        cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('capacity', {
        header: 'Capacidad',
        cell: (info) => <span className="text-slate-600">{formatCapacity(info.getValue())}</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => <VehicleStatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('lastMaintenance', {
        header: 'Ultimo mantenimiento',
        cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-500"
              onClick={() => setSelectedVehicle(row.original)}
              aria-label="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-500"
              onClick={() => {
                setSelectedVehicle(row.original);
                setIsFormOpen(true);
              }}
              aria-label="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="danger"
              className="h-8 w-8 p-0"
              onClick={() => handleDelete(row.original)}
              aria-label="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [handleDelete],
  );

  const table = useReactTable({
    data: filteredVehicles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Gestion de Vehiculos</h1>
        <p className="mt-2 text-sm text-[#64748B]">Administra tu flota de vehiculos de transporte</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total de vehiculos" value={metrics.total} icon={<Truck className="h-5 w-5" />} tone="green" />
        <MetricCard title="Vehiculos operativos" value={metrics.operational} icon={<TrendingUp className="h-5 w-5" />} tone="green" />
        <MetricCard title="En mantenimiento" value={metrics.maintenance} icon={<Wrench className="h-5 w-5" />} tone="amber" />
        <MetricCard title="Capacidad disponible" value={metrics.capacity} icon={<Package className="h-5 w-5" />} tone="blue" />
      </div>

      <Card className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por matricula o tipo..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | VehicleStatus)}>
            <option value="all">Todos los estados</option>
            <option value="operational">Operativo</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="out_of_service">Fuera de servicio</option>
          </Select>
          <Button
            onClick={() => {
              setSelectedVehicle(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Agregar vehiculo
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {vehiclesQuery.isLoading ? (
          <div className="space-y-3 p-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : vehiclesQuery.isError ? (
          <div className="p-5">
            <ApiErrorState onRetry={() => void vehiclesQuery.refetch()} />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#64748B]">No hay vehiculos para los filtros seleccionados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border-b border-[#E2E8F0] px-6 py-4">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#E2E8F0] last:border-b-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <VehicleFormDialog
        open={isFormOpen}
        initialVehicle={selectedVehicle}
        isSubmitting={createVehicle.isPending}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      {selectedVehicle && !isFormOpen ? (
        <Card className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{selectedVehicle.plate}</h2>
              <p className="text-sm text-[#64748B]">
                {selectedVehicle.brand} {selectedVehicle.model} · {selectedVehicle.year} · {selectedVehicle.type}
              </p>
            </div>
            <Badge className="bg-[#DFF6F1] text-[#0F766E]">{statusLabels[selectedVehicle.status]}</Badge>
          </div>
        </Card>
      ) : null}
    </section>
  );
}

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  tone: 'green' | 'amber' | 'blue';
};

const metricToneClasses: Record<MetricCardProps['tone'], string> = {
  green: 'bg-[#DFF6F1] text-[#0F766E]',
  amber: 'bg-amber-50 text-[#F59E0B]',
  blue: 'bg-blue-50 text-[#3B82F6]',
};

function MetricCard({ title, value, icon, tone }: MetricCardProps) {
  return (
    <Card className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-[#64748B]">{title}</p>
        <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${metricToneClasses[tone]}`}>{icon}</div>
    </Card>
  );
}
