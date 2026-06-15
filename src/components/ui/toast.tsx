import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ToastContext } from './toast-context';
import type { Toast } from './toast-context';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...message, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] space-y-2">
        {toasts.map((item) => {
          const Icon = item.type === 'success' ? CheckCircle2 : XCircle;

          return (
            <div
              key={item.id}
              className="flex min-w-72 items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-lg"
            >
              <Icon className={item.type === 'success' ? 'h-5 w-5 text-[#0F766E]' : 'h-5 w-5 text-[#EF4444]'} />
              {item.title}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
