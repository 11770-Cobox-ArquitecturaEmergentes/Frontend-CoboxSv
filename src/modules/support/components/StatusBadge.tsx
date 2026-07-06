import { Badge } from '@/components/ui';
import { statusBadgeClasses, statusLabels } from '../constants';
import type { TicketStatus } from '../types';

type StatusBadgeProps = {
  status: TicketStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={statusBadgeClasses[status]}>{statusLabels[status]}</Badge>
  );
}