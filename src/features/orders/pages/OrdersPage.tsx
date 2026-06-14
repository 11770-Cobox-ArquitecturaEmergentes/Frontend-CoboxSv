import { EmptyState, PageHeader } from '@/components/common';

export function OrdersPage() {
  return (
    <>
      <PageHeader title="Ordenes" description="Seguimiento de ordenes logisticas y entregas." />
      <EmptyState title="Ordenes en construccion" description="Aqui se gestionaran ordenes, prioridades y estados." />
    </>
  );
}
