import { Badge } from '@/components/ui';
import type { RouteStatus } from '../types';

const routeStatusLabels: Record<RouteStatus, string> = {
  PLANNED: 'Planificada',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
};

const routeStatusClasses: Record<RouteStatus, string> = {
  PLANNED: 'bg-amber-50 text-[#D97706] border border-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-[#2563EB] border border-blue-200',
  COMPLETED: 'bg-[#DFF6F1] text-[#0F766E] border border-teal-200',
};

export function getRouteStatusLabel(status: RouteStatus) {
  return routeStatusLabels[status] ?? status;
}

export function RouteStatusBadge({ status }: { status: RouteStatus }) {
  return <Badge className={routeStatusClasses[status]}>{getRouteStatusLabel(status)}</Badge>;
}
