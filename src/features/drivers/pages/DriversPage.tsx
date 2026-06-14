import { EmptyState, PageHeader } from '@/components/common';

export function DriversPage() {
  return (
    <>
      <PageHeader title="Conductores" description="Gestion de conductores, disponibilidad y desempeno." />
      <EmptyState title="Conductores en construccion" description="Aqui se administraran perfiles y asignaciones." />
    </>
  );
}
