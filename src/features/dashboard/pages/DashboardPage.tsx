import { EmptyState, PageHeader } from '@/components/common';

export function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Resumen operativo de flota, ordenes, rutas e incidentes." />
      <EmptyState title="Dashboard en construccion" description="Aqui se mostraran KPIs y graficos operativos." />
    </>
  );
}
