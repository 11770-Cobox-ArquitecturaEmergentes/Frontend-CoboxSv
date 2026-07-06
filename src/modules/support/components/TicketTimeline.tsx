import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ticketStatusFlow, statusBadgeClasses, statusLabels } from '../constants';
import type { TicketStatus } from '../types';
import { statusStepIndex } from '../utils';
import { cn } from '@/utils';

type TicketTimelineProps = {
  status: TicketStatus;
};

export function TicketTimeline({ status }: TicketTimelineProps) {
  const currentIndex = statusStepIndex(status);
  const totalSteps = ticketStatusFlow.length;
  const progress = totalSteps > 1 ? (currentIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-slate-200" />
        <motion.div
          className="absolute left-0 top-4 h-1 rounded-full bg-[#0F766E]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="relative flex justify-between">
          {ticketStatusFlow.map((step, index) => {
            const reached = index <= currentIndex;
            return (
              <div key={step} className="flex w-1/4 flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                    reached
                      ? 'border-[#0F766E] bg-[#0F766E] text-white'
                      : 'border-slate-200 bg-white text-[#64748B]',
                  )}
                >
                  {reached ? <Check className="h-4 w-4" /> : <span className="text-xs">{index + 1}</span>}
                </div>
                <span
                  className={cn(
                    'text-center text-xs font-medium',
                    reached ? 'text-slate-950' : 'text-[#64748B]',
                  )}
                >
                  {statusLabels[step]}
                </span>
                <span className={cn('mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium', statusBadgeClasses[step])}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}