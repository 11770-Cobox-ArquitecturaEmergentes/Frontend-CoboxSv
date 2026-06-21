import { CheckCircle2, Clock, Circle } from 'lucide-react';
import type { Order, OrderStatus } from '../types';

type OrderTraceabilityProps = {
  order: Order;
};

const states: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'RECEIVED', label: 'Recibida', description: 'La orden ha sido registrada en el sistema.' },
  { key: 'PROCESSING', label: 'Procesando', description: 'La orden se está preparando en el almacén.' },
  { key: 'READY_FOR_DISPATCH', label: 'Lista para Despacho', description: 'La orden está lista para ser asignada a una ruta.' },
  { key: 'IN_TRANSIT', label: 'En Tránsito', description: 'La orden está en camino al destino con el transportista.' },
  { key: 'DELIVERED', label: 'Entregada', description: 'La orden ha sido entregada y verificada exitosamente.' },
];

export function OrderTraceability({ order }: OrderTraceabilityProps) {
  const currentStatusIndex = states.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Trazabilidad del Servicio</h3>
      <div className="relative border-l border-[#E2E8F0] pl-6 ml-3 space-y-8">
        {states.map((state, index) => {
          const isCompleted = index <= currentStatusIndex && order.status !== 'CANCELLED';
          const isCurrent = index === currentStatusIndex;
          const isCancelled = order.status === 'CANCELLED';

          return (
            <div key={state.key} className="relative">
              {/* Icon Indicator */}
              <span className="absolute -left-9 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                {isCancelled && isCurrent ? (
                  <Circle className="h-5 w-5 text-red-500 fill-red-50" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-[#16A34A] fill-emerald-50" />
                ) : isCurrent ? (
                  <Clock className="h-5 w-5 text-[#2563EB] animate-pulse" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}
              </span>

              {/* Text content */}
              <div>
                <h4 className={`text-sm font-semibold ${isCurrent ? 'text-slate-950 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {state.label} {isCancelled && isCurrent ? ' (Cancelada)' : ''}
                </h4>
                <p className="mt-1 text-xs text-[#64748B]">{state.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
