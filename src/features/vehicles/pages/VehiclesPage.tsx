import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Eye, Package, Plus, Search, Truck, Wrench } from 'lucide-react';
import { isAxiosError } from 'axios';
import { ApiErrorState } from '@/components/shared';
import { Button, Card, Input, Select, Skeleton, useToast } from '@/components/ui';
import {
  CreateVehicleDialog,
  UpdateVehicleStatusDialog,
  VehicleDetailsPanel,
  VehicleStatusBadge,
  vehicleStatusLabels,
} from '../components';
import { useCreateVehicle, useUpdateVehicleStatus, useVehicles } from '../hooks';
import type { CreateVehiclePayload, UpdateVehicleStatusPayload, Vehicle, VehicleStatus } from '../types';

const statusOptions: { value: 'all' | VehicleStatus; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'OPERATIONAL', label: vehicleStatusLabels.OPERATIONAL },
  { value: 'ON_ROUTE', label: vehicleStatusLabels.ON_ROUTE },
  { value: 'IN_MAINTENANCE', label: vehicleStatusLabels.IN_MAINTENANCE },
  { value: 'OUT_OF_SERVICE', label: vehicleStatusLabels.OUT_OF_SERVICE },
];

function formatCapacity(value: number) {
  return `${value.toLocaleString('es-PE')} kg`;
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;
  const data = error.response?.data as { message?: string; details?: string } | undefined;
  return data?.message ?? data?.details ?? fallback;
}

export function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VehicleStatus>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>();
  const [statusVehicle, setStatusVehicle] = useState<Vehicle | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<UpdateVehicleStatusPayload['vehicleStatus'] | ''>('');

  const vehiclesQuery = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicleStatus = useUpdateVehicleStatus();
  const { toast } = useToast();

  const vehicles = useMemo(() => vehiclesQuery.data ?? [], [vehiclesQuery.data]);

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesSearch = !term || vehicle.plateNumber.toLowerCase().includes(term) || vehicle.id.includes(term);
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, vehicles]);

  const metrics = useMemo(() => {
    const operational = vehicles.filter((vehicle) => vehicle.status === 'OPERATIONAL');
    const onRoute = vehicles.filter((vehicle) => vehicle.status === 'ON_ROUTE');
    const unavailable = vehicles.filter((vehicle) => vehicle.status === 'IN_MAINTENANCE' || vehicle.status === 'OUT_OF_SERVICE');
    const operationalCapacity = operational.reduce((sum, vehicle) => sum + vehicle.capacityKg, 0);

    return {
      total: vehicles.length,
      operational: operational.length,
      onRoute: onRoute.length,
      unavailable: unavailable.length,
      operationalCapacity,
    };
  }, [vehicles]);

  const closeStatusDialog = () => {
    setStatusVehicle(null);
    setSelectedStatus('');
  };

  const openStatusDialog = (vehicle: Vehicle) => {
    setStatusVehicle(vehicle);
    setSelectedStatus(vehicle.status === 'ON_ROUTE' ? '' : (vehicle.status as UpdateVehicleStatusPayload['vehicleStatus']));
  };

  const handleCreateVehicle = (payload: CreateVehiclePayload) => {
    createVehicle.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false);
        toast({ title: 'Vehiculo creado correctamente', type: 'success' });
      },
      onError: (error) => toast({ title: getApiErrorMessage(error, 'No se pudo crear el vehiculo'), type: 'error' }),
    });
  };

  const handleUpdateStatus = () => {
    if (!statusVehicle || !selectedStatus) return;
    updateVehicleStatus.mutate(
      { vehicleId: statusVehicle.id, payload: { vehicleStatus: selectedStatus } },
      {
        onSuccess: () => {
          closeStatusDialog();
          toast({ title: 'Estado actualizado correctamente', type: 'success' });
        },
        onError: (error) => toast({ title: getApiErrorMessage(error, 'No se pudo actualizar el estado'), type: 'error' }),
      },
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Gestion de vehiculos</h1>
          <p className="mt-2 text-sm text-[#64748B]">Administra unidades, capacidad y disponibilidad de flota.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Crear vehiculo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Total" value={metrics.total} icon={<Truck className="h-5 w-5" />} tone="green" />
        <MetricCard title="Operativos" value={metrics.operational} icon={<Truck className="h-5 w-5" />} tone="green" />
        <MetricCard title="En ruta" value={metrics.onRoute} icon={<Truck className="h-5 w-5" />} tone="blue" />
        <MetricCard title="No disponibles" value={metrics.unavailable} icon={<Wrench className="h-5 w-5" />} tone="amber" />
        <MetricCard title="Capacidad operativa" value={formatCapacity(metrics.operationalCapacity)} icon={<Package className="h-5 w-5" />} tone="blue" />
      </div>

      <Card className="grid gap-4 p-5 lg:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por placa o ID..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | VehicleStatus)}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Card>

      <Card className="overflow-hidden">
        {vehiclesQuery.isError ? (
          <div className="p-5">
            <ApiErrorState onRetry={() => void vehiclesQuery.refetch()} />
          </div>
        ) : vehiclesQuery.isLoading ? (
          <div className="space-y-3 p-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#64748B]">No hay vehiculos para mostrar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="border-b border-[#E2E8F0] px-6 py-4">Placa</th>
                  <th className="border-b border-[#E2E8F0] px-6 py-4">Capacidad</th>
                  <th className="border-b border-[#E2E8F0] px-6 py-4">Estado</th>
                  <th className="border-b border-[#E2E8F0] px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-[#E2E8F0] last:border-b-0">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-950">{vehicle.plateNumber}</span>
                      <span className="mt-1 block text-xs text-slate-500">ID #{vehicle.id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{formatCapacity(vehicle.capacityKg)}</td>
                    <td className="px-6 py-4">
                      <VehicleStatusBadge status={vehicle.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="Ver detalle"
                          onClick={() => setSelectedVehicleId(vehicle.id)}
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="secondary"
                          className="h-8 px-3 text-xs"
                          disabled={vehicle.status === 'ON_ROUTE'}
                          onClick={() => openStatusDialog(vehicle)}
                        >
                          Estado
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CreateVehicleDialog
        open={isCreateOpen}
        isSubmitting={createVehicle.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateVehicle}
      />

      <UpdateVehicleStatusDialog
        open={Boolean(statusVehicle)}
        vehicle={statusVehicle}
        selectedStatus={selectedStatus}
        isSubmitting={updateVehicleStatus.isPending}
        onSelectedStatusChange={setSelectedStatus}
        onClose={closeStatusDialog}
        onSubmit={handleUpdateStatus}
      />

      {selectedVehicleId !== undefined ? (
        <VehicleDetailsPanel
          vehicleId={selectedVehicleId}
          onClose={() => setSelectedVehicleId(undefined)}
          onChangeStatus={openStatusDialog}
        />
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
  amber: 'bg-amber-50 text-[#B45309]',
  blue: 'bg-blue-50 text-[#2563EB]',
};

function MetricCard({ title, value, icon, tone }: MetricCardProps) {
  return (
    <Card className="flex items-center justify-between p-5">
      <div className="min-w-0">
        <p className="truncate text-sm text-[#64748B]">{title}</p>
        <p className="mt-2 truncate text-2xl font-bold text-slate-950">{value}</p>
      </div>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${metricToneClasses[tone]}`}>{icon}</div>
    </Card>
  );
}
