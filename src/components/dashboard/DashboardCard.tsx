import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function DashboardCard({ title, subtitle, children, className, fullHeight = false }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg',
        fullHeight && 'h-full',
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h3 className="text-base font-semibold text-[#0F172A]">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-sm text-[#64748B]">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
