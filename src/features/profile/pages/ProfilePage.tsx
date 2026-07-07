import { useState } from 'react';
import { PageHeader } from '@/components/common';
import { Button, Card, Input, Skeleton, useToast } from '@/components/ui';
import { useProfile, useUpdateProfile } from '../hooks';
import type { UserProfile } from '../types';

type ProfileFormProps = {
  profile: UserProfile;
  isSubmitting: boolean;
  onSubmit: (values: {
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    locale: string;
  }) => Promise<void>;
};

function ProfileForm({ profile, isSubmitting, onSubmit }: ProfileFormProps) {
  const [name, setName] = useState(profile.name ?? '');
  const [firstName, setFirstName] = useState(profile.firstName ?? '');
  const [lastName, setLastName] = useState(profile.lastName ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [locale, setLocale] = useState(profile.locale ?? 'es-PE');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    await onSubmit({
      name: name.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      locale,
    });
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="space-y-1">
        <label htmlFor="profile-email" className="block text-sm font-medium text-slate-700">
          Correo electronico
        </label>
        <Input id="profile-email" value={profile.email} disabled />
      </div>
      <div className="space-y-1">
        <label htmlFor="profile-name" className="block text-sm font-medium text-slate-700">
          Nombre
        </label>
        <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div className="space-y-1">
        <label htmlFor="profile-firstName" className="block text-sm font-medium text-slate-700">
          Nombre (detalle)
        </label>
        <Input id="profile-firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
      </div>
      <div className="space-y-1">
        <label htmlFor="profile-lastName" className="block text-sm font-medium text-slate-700">
          Apellido
        </label>
        <Input id="profile-lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
      </div>
      <div className="space-y-1">
        <label htmlFor="profile-phone" className="block text-sm font-medium text-slate-700">
          Telefono
        </label>
        <Input id="profile-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
      </div>
      <div className="space-y-1">
        <label htmlFor="profile-locale" className="block text-sm font-medium text-slate-700">
          Idioma / Region
        </label>
        <Input id="profile-locale" value={locale} onChange={(event) => setLocale(event.target.value)} />
      </div>
      {error ? <p className="text-sm text-[#EF4444]">{error}</p> : null}
      <div className="flex justify-end pt-4">
        <Button type="button" disabled={isSubmitting} onClick={() => void handleSubmit()}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </Card>
  );
}

export function ProfilePage() {
  const { toast } = useToast();
  const profileQuery = useProfile();
  const updateMutation = useUpdateProfile();
  const profile = profileQuery.data;

  const handleSubmit = async (values: {
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    locale: string;
  }) => {
    try {
      await updateMutation.mutateAsync({
        name: values.name,
        firstName: values.firstName || null,
        lastName: values.lastName || null,
        phone: values.phone || null,
        locale: values.locale,
      });
      toast({ title: 'Perfil actualizado', type: 'success' });
    } catch (err) {
      const message = (err as { message?: string }).message ?? 'No se pudo actualizar el perfil';
      toast({ title: message, type: 'error' });
    }
  };

  return (
    <>
      <PageHeader title="Perfil de usuario" description="Datos de usuario y preferencias." />
      <div className="px-4 md:px-8 py-6 space-y-6">
        {profileQuery.isError ? (
          <Card className="p-5">
            <p className="text-sm text-[#EF4444]">No se pudo cargar el perfil.</p>
          </Card>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2">
          {profileQuery.isLoading || !profile ? (
            <Card className="p-5">
              <Skeleton className="h-40 w-full" />
            </Card>
          ) : (
            <ProfileForm
              key={profile.id}
              profile={profile}
              isSubmitting={updateMutation.isPending}
              onSubmit={handleSubmit}
            />
          )}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Resumen de cuenta</h2>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Correo</p>
              <p className="mt-1 text-sm text-slate-950">{profile?.email ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Rol</p>
              {profile?.role ? (
                <span className="mt-1 inline-block rounded bg-[#DFF6F1] px-2 py-0.5 text-xs font-medium text-[#0F766E]">
                  {profile.role}
                </span>
              ) : (
                <p className="mt-1 text-sm text-slate-500">-</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">ID de usuario</p>
              <p className="mt-1 font-mono text-xs text-slate-900">{profile?.id ?? '-'}</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}