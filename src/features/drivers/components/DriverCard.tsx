import { ClipboardList, UserRound } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/utils';
import type { Driver, DriverStatus } from '../types';

const driverStatusLabels: Record<DriverStatus, string> = {
  AVAILABLE: 'Disponible',
  ASSIGNED: 'Asignado',
  OFFLINE: 'Desconectado',
  ON_ROUTE: 'En ruta',
  ON_BREAK: 'En descanso',
  UNAVAILABLE: 'No disponible',
};

const driverStatusClasses: Record<DriverStatus, string> = {
  AVAILABLE: 'bg-[#DFF6F1] text-[#0F766E]',
  ASSIGNED: 'bg-blue-50 text-[#2563EB]',
  OFFLINE: 'bg-slate-100 text-[#64748B]',
  ON_ROUTE: 'bg-blue-50 text-[#2563EB]',
  ON_BREAK: 'bg-amber-50 text-[#D97706]',
  UNAVAILABLE: 'bg-red-50 text-[#EF4444]',
};

type DriverCardProps = {
  driver: Driver;
  assignedRoutes?: number;
  onSelect: (driverId: string) => void;
};

export function getDriverStatusLabel(status: DriverStatus) {
  return driverStatusLabels[status] ?? status;
}

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  return (
    <Badge className={cn('whitespace-nowrap', driverStatusClasses[status] ?? 'bg-slate-100 text-[#64748B]')}>
      {getDriverStatusLabel(status)}
    </Badge>
  );
}

export function DriverCard({ driver, assignedRoutes, onSelect }: DriverCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DFF6F1] text-[#0F766E]">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-950">Conductor #{driver.id}</h2>
            <p className="mt-1 truncate text-sm text-[#64748B]">{driver.email}</p>
            <p className="mt-0.5 text-sm text-[#64748B]">Licencia {driver.licenceNumber}</p>
          </div>
        </div>
        <DriverStatusBadge status={driver.status} />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm text-[#64748B]">
        <span className="inline-flex items-center gap-2">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          Rutas asignadas
        </span>
        <span className="font-semibold text-slate-950">{assignedRoutes ?? '-'}</span>
      </div>

      <Button variant="secondary" className="mt-4 w-full" onClick={() => onSelect(driver.id)}>
        Ver detalle
      </Button>
    </Card>
  );
}
