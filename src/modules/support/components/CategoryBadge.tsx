import { Badge } from '@/components/ui';
import { categoryBadgeClasses, categoryLabels } from '../constants';
import type { TicketCategory } from '../types';

type CategoryBadgeProps = {
  category: TicketCategory;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge className={categoryBadgeClasses[category]}>{categoryLabels[category]}</Badge>
  );
}