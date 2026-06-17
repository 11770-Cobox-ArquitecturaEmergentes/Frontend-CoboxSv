import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils';

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#DFF6F1]',
        className,
      )}
      {...props}
    />
  );
}
