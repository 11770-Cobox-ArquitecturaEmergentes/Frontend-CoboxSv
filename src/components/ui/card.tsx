import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border border-[#E2E8F0] bg-white', className)} {...props} />;
}
