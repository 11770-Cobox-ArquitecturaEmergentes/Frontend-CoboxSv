import { EmptyState, PageHeader } from '@/components/common';

export function ProfilePage() {
  return (
    <>
      <PageHeader title="Perfil de usuario" description="Preferencias, informacion personal y seguridad de cuenta." />
      <EmptyState title="Perfil en construccion" description="Aqui se editaran datos de usuario y credenciales." />
    </>
  );
}
