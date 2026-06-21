import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Wrench,
  Search,
  Truck,
  X,
  History,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Eye,
} from 'lucide-react';
import { Badge, Button, Card, Input, Skeleton, useToast } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import type { Vehicle, VehicleStatus } from '@/modules/fleet.types';
import { useMaintenanceVehicles, useVehicleStatusHistory, useUpdateVehicleStatus } from '../hooks';
import { ChangeStatusDialog } from '../components';

const columnHelper = createColumnHelper<Vehicle>();

const statusLabels: Record<VehicleStatus, string> = {
  operational: 'Operativo (AVAILABLE)',
  maintenance: 'Mantenimiento (MAINTENANCE)',
  out_of_service: 'Fuera de servicio (INACTIVE)',
};

const statusClasses: Record<VehicleStatus, string> = {
  operational: 'bg-[#DFF6F1] text-[#0F766E] border border-teal-205',
  maintenance: 'bg-amber-50 text-amber-700 border border-amber-200',
  out_of_service: 'bg-red-50 text-red-755 border border-red-200',
};

export function MaintenancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VehicleStatus>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);

  const { toast } = useToast();
  const vehiclesQuery = useMaintenanceVehicles();
  const historyQuery = useVehicleStatusHistory(selectedVehicle?.id);
  const updateStatusMutation = useUpdateVehicleStatus();

  const vehicles = useMemo(() => vehiclesQuery.data ?? [], [vehiclesQuery.data]);
  const history = useMemo(() => historyQuery.data ?? [], [historyQuery.data]);

  // Filtrar vehículos
  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.plate.toLowerCase().includes(term) ||
        vehicle.brand.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, search, statusFilter]);

  const activeSelectedVehicle = useMemo(() => {
    if (!selectedVehicle) return null;
    return vehicles.find((v) => v.id === selectedVehicle.id) || null;
  }, [vehicles, selectedVehicle]);

  // Métricas de flota
  const metrics = useMemo(() => {
    return {
      total: vehicles.length,
      maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
      outOfService: vehicles.filter((v) => v.status === 'out_of_service').length,
      operational: vehicles.filter((v) => v.status === 'operational').length,
    };
  }, [vehicles]);

  const handleChangeStatusSubmit = (status: VehicleStatus, reason: string) => {
    if (!selectedVehicle) return;
    updateStatusMutation.mutate(
      { vehicleId: selectedVehicle.id, status, reason },
      {
        onSuccess: (updated) => {
          setSelectedVehicle(updated);
          setIsChangeStatusOpen(false);
          toast({ title: 'Estado de vehículo actualizado correctamente', type: 'success' });
        },
        onError: (err: any) => {
          toast({ title: err.message || 'Error al cambiar estado', type: 'error' });
        },
      }
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('plate', {
        header: 'Matrícula',
        cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span>,
      }),
      columnHelper.accessor('brand', {
        header: 'Vehículo / Perfil',
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-slate-800 font-medium">{info.getValue()} {info.row.original.model}</span>
            <span className="text-xs text-[#64748B]">{info.row.original.type}</span>
          </div>
        ),
      }),
      columnHelper.accessor('capacity', {
        header: 'Capacidad',
        cell: (info) => <span className="text-slate-600 font-medium">{(info.getValue() / 1000).toFixed(1)} t</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Estado Actual',
        cell: (info) => {
          const status = info.getValue();
          return <Badge className={statusClasses[status]}>{statusLabels[status]}</Badge>;
        },
      }),
      columnHelper.accessor('lastMaintenance', {
        header: 'Último Servicio',
        cell: (info) => <span className="text-slate-650 font-medium text-xs">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-slate-500"
            onClick={() => setSelectedVehicle(row.original)}
            aria-label="Ver detalle e historial"
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredVehicles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Mantenimiento de Flota</h1>
        <p className="mt-2 text-sm text-[#64748B]">Control de inspecciones, cambios de estado operativo e historial mecánico.</p>
      </div>

      {/* Tarjetas métricas */}
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard title="Total Vehículos" value={metrics.total} icon={<Truck className="h-5 w-5" />} tone="blue" />
        <MetricCard title="En Mantenimiento" value={metrics.maintenance} icon={<Wrench className="h-5 w-5" />} tone="amber" />
        <MetricCard title="Fuera de Servicio" value={metrics.outOfService} icon={<AlertOctagon className="h-5 w-5" />} tone="red" />
        <MetricCard title="Operativos / Disponibles" value={metrics.operational} icon={<CheckCircle2 className="h-5 w-5" />} tone="green" />
      </div>

      <Card className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por placa, marca o modelo..."
            className="pl-9"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as any)}
            className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="operational">Operativo (AVAILABLE)</option>
            <option value="maintenance">Mantenimiento (MAINTENANCE)</option>
            <option value="out_of_service">Fuera de servicio (INACTIVE)</option>
          </select>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className={`overflow-hidden lg:col-span-2 ${activeSelectedVehicle ? '' : 'lg:col-span-3'}`}>
          {vehiclesQuery.isLoading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : vehiclesQuery.isError ? (
            <div className="p-5">
              <ApiErrorState onRetry={() => void vehiclesQuery.refetch()} />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#64748B] font-medium">
              No hay vehículos registrados para los filtros seleccionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
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
                    <tr key={row.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-slate-50 transition-colors">
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

        {activeSelectedVehicle && (
          <Card className="p-5 flex flex-col justify-between h-fit space-y-6">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Unidad #{activeSelectedVehicle.id}</h2>
                <span className="text-xs text-[#64748B] font-semibold">Placa: {activeSelectedVehicle.plate}</span>
              </div>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedVehicle(null)}
                aria-label="Cerrar detalle"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#64748B] font-semibold block uppercase">Perfil</span>
                  <span className="text-slate-800 font-semibold text-sm">
                    {activeSelectedVehicle.brand} {activeSelectedVehicle.model}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] font-semibold block uppercase">Capacidad de Carga</span>
                  <span className="text-slate-800 font-semibold text-sm">
                    {activeSelectedVehicle.capacity.toLocaleString('es-PE')} kg
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#64748B] font-semibold block uppercase">Estado de Flota</span>
                  <Badge className={`mt-1 ${statusClasses[activeSelectedVehicle.status]}`}>
                    {statusLabels[activeSelectedVehicle.status]}
                  </Badge>
                </div>
                <div>
                  <span className="text-[#64748B] font-semibold block uppercase">Último Mantenimiento</span>
                  <div className="flex items-center gap-1 mt-1 text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{activeSelectedVehicle.lastMaintenance}</span>
                  </div>
                </div>
              </div>

              {/* Historial de Cambios de Estado */}
              <div className="border-t border-[#E2E8F0] pt-4">
                <div className="flex items-center gap-1.5 mb-3 text-[#64748B]">
                  <History className="h-4 w-4 text-[#2563EB]" />
                  <span className="font-semibold block uppercase">Historial de Cambios de Estado</span>
                </div>
                {historyQuery.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-slate-400 italic">No hay registros de transiciones para esta unidad.</p>
                ) : (
                  <div className="relative border-l border-slate-200 pl-4 ml-1 space-y-3.5">
                    {history.map((log, index) => (
                      <div key={index} className="relative">
                        <span className="absolute -left-[20px] top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white border border-[#E2E8F0]">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        </span>
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-0.5">
                            <Badge className={`px-1 py-0 text-[9px] ${statusClasses[log.status]}`}>
                              {statusLabels[log.status].split(' ')[0]}
                            </Badge>
                            <span>{new Date(log.changedAt).toLocaleDateString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium">{log.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0]">
              <Button className="w-full h-10 text-xs" onClick={() => setIsChangeStatusOpen(true)}>
                Cambiar Estado de la Unidad
              </Button>
            </div>
          </Card>
        )}
      </div>

      {activeSelectedVehicle && (
        <ChangeStatusDialog
          open={isChangeStatusOpen}
          vehicleId={activeSelectedVehicle.id}
          currentStatus={activeSelectedVehicle.status}
          isSubmitting={updateStatusMutation.isPending}
          onClose={() => setIsChangeStatusOpen(false)}
          onSubmit={handleChangeStatusSubmit}
        />
      )}
    </section>
  );
}

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tone: 'green' | 'amber' | 'blue' | 'red';
};

const metricToneClasses: Record<MetricCardProps['tone'], string> = {
  green: 'bg-[#DFF6F1] text-[#0F766E]',
  amber: 'bg-amber-50 text-[#F59E0B]',
  blue: 'bg-blue-50 text-[#3B82F6]',
  red: 'bg-red-50 text-[#EF4444]',
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
