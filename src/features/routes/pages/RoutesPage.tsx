import { EmptyState, PageHeader } from '@/components/common';

export function RoutesPage() {
  return (
    <>
      <PageHeader title="Rutas" description="Planificacion, asignacion y monitoreo de rutas." />
      <EmptyState title="Rutas en construccion" description="Aqui se visualizaran recorridos, paradas y desvio." />
    </>
  );
}
