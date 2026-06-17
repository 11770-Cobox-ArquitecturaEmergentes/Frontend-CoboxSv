import { useMemo, useState } from 'react';
import { Plus, Search, UserRound } from 'lucide-react';
import { Badge, Button, Card, Input, Skeleton, useToast } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import { useCreateDriver, useDrivers } from '../hooks';
import type { CreateDriverPayload, DriverStatus } from '@/modules/fleet.types';
import { driverSchema } from '../schemas/driver.schema';

const driverStatusLabels: Record<DriverStatus, string> = {
  available: 'Disponible',
  assigned: 'Asignado',
  offline: 'Desconectado',
};

const driverStatusClasses: Record<DriverStatus, string> = {
  available: 'bg-[#DFF6F1] text-[#0F766E]',
  assigned: 'bg-blue-50 text-[#3B82F6]',
  offline: 'bg-slate-100 text-[#64748B]',
};

export function DriversPage() {
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<CreateDriverPayload>({ name: '', license: '', status: 'available' });
  const [error, setError] = useState<string | null>(null);
  const driversQuery = useDrivers();
  const createDriver = useCreateDriver();
  const { toast } = useToast();

  const drivers = useMemo(() => driversQuery.data ?? [], [driversQuery.data]);
  const filteredDrivers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(normalizedSearch) ||
        driver.license.toLowerCase().includes(normalizedSearch),
    );
  }, [drivers, search]);

  const handleCreate = () => {
    const result = driverSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Formulario invalido');
      return;
    }

    createDriver.mutate(result.data, {
      onSuccess: () => {
        setError(null);
        setForm({ name: '', license: '', status: 'available' });
        toast({ title: 'Conductor agregado correctamente', type: 'success' });
      },
      onError: () => toast({ title: 'No se pudo agregar el conductor', type: 'error' }),
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Gestion de Conductores</h1>
        <p className="mt-2 text-sm text-[#64748B]">Control de licencias, disponibilidad y rutas asignadas.</p>
      </div>

      <Card className="grid gap-4 p-5 xl:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o licencia..." className="pl-9" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4 xl:w-[720px]">
          <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nombre" />
          <Input value={form.license} onChange={(event) => setForm((current) => ({ ...current, license: event.target.value }))} placeholder="Licencia" />
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as DriverStatus }))}
            className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm"
          >
            <option value="available">Disponible</option>
            <option value="assigned">Asignado</option>
            <option value="offline">Desconectado</option>
          </select>
          <Button onClick={handleCreate} disabled={createDriver.isPending}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
        {error ? <p className="text-sm font-medium text-[#EF4444] xl:col-span-2">{error}</p> : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {driversQuery.isError ? (
          <div className="lg:col-span-3">
            <ApiErrorState onRetry={() => void driversQuery.refetch()} />
          </div>
        ) : driversQuery.isLoading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-36" />)
          : filteredDrivers.map((driver) => (
              <Card key={driver.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DFF6F1] text-[#0F766E]">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-950">{driver.name}</h2>
                      <p className="mt-1 text-sm text-[#64748B]">Licencia {driver.license}</p>
                    </div>
                  </div>
                  <Badge className={driverStatusClasses[driver.status]}>{driverStatusLabels[driver.status]}</Badge>
                </div>
                <div className="mt-5 rounded-lg bg-slate-50 p-3 text-sm text-[#64748B]">
                  Rutas asignadas: <span className="font-semibold text-slate-950">{driver.assignedRoutes}</span>
                </div>
              </Card>
            ))}
      </div>

      {!driversQuery.isLoading && !driversQuery.isError && filteredDrivers.length === 0 ? (
        <Card className="p-10 text-center text-sm text-[#64748B]">No hay conductores para mostrar.</Card>
      ) : null}
    </section>
  );
}
