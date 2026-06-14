import { EmptyState, PageHeader } from '@/components/common';

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Configuracion" description="Parametros del sistema, permisos y preferencias operativas." />
      <EmptyState title="Configuracion en construccion" description="Aqui se centralizaran ajustes empresariales." />
    </>
  );
}
