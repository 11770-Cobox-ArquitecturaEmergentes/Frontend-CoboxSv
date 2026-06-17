import { Badge } from '@/components/ui';
import type { VehicleStatus } from '@/modules/fleet.types';

const statusMap: Record<VehicleStatus, { label: string; className: string }> = {
  operational: {
    label: 'Operativo',
    className: 'bg-[#DFF6F1] text-[#0F766E]',
  },
  maintenance: {
    label: 'Mantenimiento',
    className: 'bg-amber-50 text-amber-700',
  },
  out_of_service: {
    label: 'Fuera de servicio',
    className: 'bg-red-50 text-[#EF4444]',
  },
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const statusConfig = statusMap[status];

  return <Badge className={statusConfig.className}>{statusConfig.label}</Badge>;
}
