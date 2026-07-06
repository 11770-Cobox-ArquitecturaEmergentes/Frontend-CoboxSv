import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

type StatisticCardProps = {
  icon: LucideIcon;
  value: number;
  label: string;
  iconClassName?: string;
};

export function StatisticCard({ icon: Icon, value, label, iconClassName }: StatisticCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="flex items-center gap-4 p-5 shadow-sm transition-shadow hover:shadow-md">
        <div
          className={
            'flex h-12 w-12 items-center justify-center rounded-full ' +
            (iconClassName ?? 'bg-[#DFF6F1] text-[#0F766E]')
          }
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="text-sm text-[#64748B]">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}