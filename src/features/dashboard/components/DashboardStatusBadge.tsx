import { Badge } from '@/components/ui';
import { cn } from '@/utils';
import { formatStatusLabel } from '../utils/formatters';

const statusTone: Record<string, string> = {
  ACTIVE: 'bg-teal-50 text-[#0F766E]',
  AVAILABLE: 'bg-teal-50 text-[#0F766E]',
  COMPLETED: 'bg-teal-50 text-[#0F766E]',
  CRITICAL: 'bg-red-50 text-[#EF4444]',
  DELIVERED: 'bg-teal-50 text-[#0F766E]',
  ESCALATED: 'bg-red-50 text-[#EF4444]',
  HIGH: 'bg-red-50 text-[#EF4444]',
  IN_PROGRESS: 'bg-blue-50 text-[#2563EB]',
  IN_TRANSIT: 'bg-blue-50 text-[#2563EB]',
  LOW: 'bg-slate-100 text-slate-700',
  MEDIUM: 'bg-amber-50 text-[#D97706]',
  OPEN: 'bg-amber-50 text-[#D97706]',
  PENDING: 'bg-amber-50 text-[#D97706]',
  READY_FOR_DISPATCH: 'bg-blue-50 text-[#2563EB]',
  SCHEDULED: 'bg-blue-50 text-[#2563EB]',
  CANCELLED: 'bg-red-50 text-[#EF4444]',
};

type DashboardStatusBadgeProps = {
  value: string | null | undefined;
};

export function DashboardStatusBadge({ value }: DashboardStatusBadgeProps) {
  const status = value ?? 'UNKNOWN';
  return (
    <Badge className={cn('whitespace-nowrap bg-slate-100 text-slate-700', statusTone[status])}>
      {formatStatusLabel(status)}
    </Badge>
  );
}
