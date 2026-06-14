import { EmptyState, PageHeader } from '@/components/common';

export function MaintenancePage() {
  return (
    <>
      <PageHeader title="Mantenimiento" description="Control preventivo y correctivo de vehiculos." />
      <EmptyState title="Mantenimiento en construccion" description="Aqui se programaran servicios, inspecciones y reparaciones." />
    </>
  );
}
