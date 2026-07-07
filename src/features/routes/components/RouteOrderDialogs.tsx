import { Dialog, Button, Select } from '@/components/ui';
import type { Order } from '@/features/orders';
import type { Route } from '../types';

type RouteOrderDialogProps = {
  open: boolean;
  title: string;
  route: Route | null;
  orders: Order[];
  selectedOrderId: string;
  isSubmitting: boolean;
  emptyMessage: string;
  submitLabel: string;
  onSelectedOrderChange: (orderId: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function RouteOrderDialog({
  open,
  title,
  route,
  orders,
  selectedOrderId,
  isSubmitting,
  emptyMessage,
  submitLabel,
  onSelectedOrderChange,
  onClose,
  onSubmit,
}: RouteOrderDialogProps) {
  return (
    <Dialog open={open} title={title} onClose={onClose}>
      <div className="space-y-4">
        {route ? <p className="text-sm text-slate-500">Ruta: {route.title}</p> : null}
        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            {emptyMessage}
          </div>
        ) : (
          <Select value={selectedOrderId} onChange={(event) => onSelectedOrderChange(event.target.value)} className="w-full">
            <option value="">Selecciona una orden</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                Orden #{order.id} - {order.city}, {order.country} ({order.status})
              </option>
            ))}
          </Select>
        )}
        <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={!route || !selectedOrderId || isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export function AddOrderToRouteDialog(props: Omit<RouteOrderDialogProps, 'title' | 'emptyMessage' | 'submitLabel'>) {
  return (
    <RouteOrderDialog
      {...props}
      title="Agregar orden a ruta"
      emptyMessage="No hay ordenes listas para despacho disponibles. En la vista de ordenes, marca una orden como lista para despacho antes de asignarla."
      submitLabel="Agregar orden"
    />
  );
}

export function AddDeliveredOrderToRouteDialog(props: Omit<RouteOrderDialogProps, 'title' | 'emptyMessage' | 'submitLabel'>) {
  return (
    <RouteOrderDialog
      {...props}
      title="Registrar orden entregada"
      emptyMessage="No hay ordenes pendientes de registrar como entregadas."
      submitLabel="Registrar entregada"
    />
  );
}
