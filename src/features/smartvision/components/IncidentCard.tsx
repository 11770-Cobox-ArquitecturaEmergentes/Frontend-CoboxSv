import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { Badge } from '@/components/ui';
import type { Incident } from '../types';

const statusBadgeClasses: Record<string, string> = {
  critical: 'bg-red-50 text-[#EF4444]',
  warning: 'bg-amber-50 text-[#F59E0B]',
};

const statusLabels: Record<string, string> = {
  critical: 'Crítico',
  warning: 'Advertencia',
};

const iconClasses: Record<string, string> = {
  critical: 'bg-red-50 text-[#EF4444]',
  warning: 'bg-amber-50 text-[#F59E0B]',
};

type IncidentCardProps = {
  incident: Incident;
  index: number;
};

export function IncidentCard({ incident, index }: IncidentCardProps) {
  const IconComponent = incident.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer rounded-xl border border-[#E5E7EB] bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              iconClasses[incident.status],
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#111827]">{incident.type}</h3>
            <p className="mt-0.5 text-sm text-[#6B7280]">{incident.driver}</p>
            <p className="text-sm text-[#6B7280]">{incident.vehicle}</p>
            <p className="mt-1 text-xs text-[#9CA3AF]">{incident.location}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge className={cn('text-xs font-medium', statusBadgeClasses[incident.status])}>
            {statusLabels[incident.status]}
          </Badge>
          <span className="text-xs text-[#9CA3AF]">{incident.time}</span>
        </div>
      </div>
    </motion.div>
  );
}
