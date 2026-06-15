import { AlertCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';

type ApiErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ApiErrorState({
  title = 'No se pudo cargar la informacion',
  message = 'Verifica que el backend este disponible y que VITE_API_URL apunte al servicio correcto.',
  onRetry,
}: ApiErrorStateProps) {
  return (
    <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-[#EF4444]">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-[#64748B]">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </Card>
  );
}
