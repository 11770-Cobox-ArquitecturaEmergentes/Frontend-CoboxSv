import { motion } from 'framer-motion';
import { cn } from '@/utils';
import type { KpiData } from '../types';

const progressColors: Record<string, string> = {
  green: 'bg-[#22C55E]',
  orange: 'bg-[#F59E0B]',
  red: 'bg-[#EF4444]',
  default: 'bg-[#0F766E]',
};

const iconBgColors: Record<string, string> = {
  green: 'bg-[#22C55E]',
  orange: 'bg-[#F59E0B]',
  red: 'bg-[#EF4444]',
  default: 'bg-[#DFF6F1]',
};

const iconTextColors: Record<string, string> = {
  green: 'text-white',
  orange: 'text-white',
  red: 'text-white',
  default: 'text-[#0F766E]',
};

type StatsCardProps = {
  kpi: KpiData;
  index: number;
};

export function StatsCard({ kpi, index }: StatsCardProps) {
  const IconComponent = kpi.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-[#6B7280]">{kpi.title}</p>
          <p className="text-3xl font-bold text-[#111827]">{kpi.value}</p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            iconBgColors[kpi.color],
          )}
        >
          <IconComponent className={cn('h-5 w-5', iconTextColors[kpi.color])} />
        </div>
      </div>

      {kpi.progress !== undefined ? (
        <div className="mt-4 space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${kpi.progress}%` }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
              className={cn('h-full rounded-full', progressColors[kpi.color])}
            />
          </div>
          <p className="text-xs text-[#6B7280]">{kpi.subtitle}</p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-xs text-[#6B7280]">{kpi.subtitle}</p>
        </div>
      )}
    </motion.div>
  );
}
