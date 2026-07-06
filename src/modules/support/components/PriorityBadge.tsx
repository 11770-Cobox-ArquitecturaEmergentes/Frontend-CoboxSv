import { Badge } from '@/components/ui';
import { priorityBadgeClasses, priorityLabels } from '../constants';
import type { TicketPriority } from '../types';

type PriorityBadgeProps = {
  priority: TicketPriority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge className={priorityBadgeClasses[priority]}>{priorityLabels[priority]}</Badge>
  );
}