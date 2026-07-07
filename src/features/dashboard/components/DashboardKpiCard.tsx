import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/utils';

type DashboardKpiCardProps = {
  title: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  tone?: 'teal' | 'blue' | 'amber' | 'red' | 'slate';
};

const toneClasses: Record<NonNullable<DashboardKpiCardProps['tone']>, string> = {
  teal: 'bg-teal-50 text-[#0F766E]',
  blue: 'bg-blue-50 text-[#2563EB]',
  amber: 'bg-amber-50 text-[#D97706]',
  red: 'bg-red-50 text-[#EF4444]',
  slate: 'bg-slate-100 text-slate-700',
};

export function DashboardKpiCard({ title, value, detail, icon: Icon, tone = 'slate' }: DashboardKpiCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value.toLocaleString('es-PE')}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', toneClasses[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}
