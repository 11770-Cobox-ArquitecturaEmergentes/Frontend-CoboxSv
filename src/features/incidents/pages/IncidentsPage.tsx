import { EmptyState, PageHeader } from '@/components/common';

export function IncidentsPage() {
  return (
    <>
      <PageHeader title="Incidentes" description="Registro y seguimiento de eventos operativos y alertas." />
      <EmptyState title="Incidentes en construccion" description="Aqui se clasificaran incidentes, severidad y resolucion." />
    </>
  );
}
