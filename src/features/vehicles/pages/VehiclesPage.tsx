import { EmptyState, PageHeader } from '@/components/common';

export function VehiclesPage() {
  return (
    <>
      <PageHeader title="Vehiculos" description="Administracion y monitoreo de unidades de flota." />
      <EmptyState title="Vehiculos en construccion" description="Aqui se listaran unidades, estados y telemetria." />
    </>
  );
}
