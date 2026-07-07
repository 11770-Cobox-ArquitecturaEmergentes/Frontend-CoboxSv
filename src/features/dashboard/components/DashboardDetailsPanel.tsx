import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui';

type DashboardDetailsPanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
};

export function DashboardDetailsPanel({ title, subtitle, children, onClose }: DashboardDetailsPanelProps) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30">
      <aside className="flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <Button variant="ghost" className="h-9 w-9 shrink-0 px-0" aria-label="Cerrar panel" onClick={onClose}>
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
