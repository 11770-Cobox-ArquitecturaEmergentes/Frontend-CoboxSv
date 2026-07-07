import { Badge } from '@/components/ui';
import type { VehicleStatus } from '../types';

type VehicleStatusBadgeProps = {
  status: VehicleStatus;
};

const statusLabels: Record<VehicleStatus, string> = {
  OPERATIONAL: 'Operativo',
  ON_ROUTE: 'En ruta',
  IN_MAINTENANCE: 'En mantenimiento',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

const statusClasses: Record<VehicleStatus, string> = {
  OPERATIONAL: 'bg-[#DFF6F1] text-[#0F766E]',
  ON_ROUTE: 'bg-blue-50 text-[#2563EB]',
  IN_MAINTENANCE: 'bg-amber-50 text-[#B45309]',
  OUT_OF_SERVICE: 'bg-red-50 text-[#EF4444]',
};

export function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  return <Badge className={statusClasses[status]}>{statusLabels[status]}</Badge>;
}

export { statusLabels as vehicleStatusLabels };
