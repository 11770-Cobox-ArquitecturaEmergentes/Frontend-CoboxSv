import { EmptyState, PageHeader } from '@/components/common';

export function ReportsPage() {
  return (
    <>
      <PageHeader title="Reportes" description="Analitica operativa, exportaciones y tableros historicos." />
      <EmptyState title="Reportes en construccion" description="Aqui se mostraran graficos, filtros y descargas." />
    </>
  );
}
