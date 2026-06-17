import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#DFF6F1]',
        className,
      )}
      {...props}
    />
  );
}
