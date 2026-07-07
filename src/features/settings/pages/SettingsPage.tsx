import { useState } from 'react';
import { PageHeader } from '@/components/common';
import { Button, Card, Input, Select, Skeleton, useToast } from '@/components/ui';
import { useSettings, useUpdateSettings } from '../hooks';
import type { UserSettings } from '../types';

const localeOptions = [
  { value: 'es-PE', label: 'Espanol (Peru)' },
  { value: 'es-ES', label: 'Espanol (Espana)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'pt-BR', label: 'Portugues (Brasil)' },
];

type SettingsFormProps = {
  settings: UserSettings;
  isSubmitting: boolean;
  onSubmit: (values: { locale: string; name: string }) => Promise<void>;
};

function SettingsForm({ settings, isSubmitting, onSubmit }: SettingsFormProps) {
  const [locale, setLocale] = useState(settings.locale ?? 'es-PE');
  const [name, setName] = useState(settings.name ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError('El nombre mostrado es obligatorio.');
      return;
    }
    await onSubmit({ locale, name: name.trim() });
  };

  return (
    <>
      <div className="space-y-1">
        <label htmlFor="settings-name" className="block text-sm font-medium text-slate-700">
          Nombre mostrado
        </label>
        <Input id="settings-name" value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div className="space-y-1">
        <label htmlFor="settings-locale" className="block text-sm font-medium text-slate-700">
          Idioma / Region
        </label>
        <Select
          id="settings-locale"
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          className="w-full"
        >
          {localeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      {error ? <p className="text-sm text-[#EF4444]">{error}</p> : null}
      <div className="flex justify-end pt-2">
        <Button type="button" disabled={isSubmitting} onClick={() => void handleSubmit()}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </>
  );
}

export function SettingsPage() {
  const { toast } = useToast();
  const settingsQuery = useSettings();
  const updateMutation = useUpdateSettings();
  const settings = settingsQuery.data;

  const handleSubmit = async (values: { locale: string; name: string }) => {
    try {
      await updateMutation.mutateAsync({ locale: values.locale, name: values.name });
      toast({ title: 'Configuracion guardada', type: 'success' });
    } catch (err) {
      const message = (err as { message?: string }).message ?? 'No se pudo guardar la configuracion';
      toast({ title: message, type: 'error' });
    }
  };

  return (
    <>
      <PageHeader title="Configuracion" description="Preferencias de la cuenta y del sistema." />
      <div className="px-4 md:px-8 py-6 space-y-6">
        <Card className="p-5 space-y-4 max-w-xl">
          {settingsQuery.isLoading || !settings ? (
            <Skeleton className="h-8 w-full" />
          ) : settingsQuery.isError ? (
            <p className="text-sm text-[#EF4444]">No se pudo cargar la configuracion.</p>
          ) : (
            <SettingsForm
              key={settings.email ?? 'me'}
              settings={settings}
              isSubmitting={updateMutation.isPending}
              onSubmit={handleSubmit}
            />
          )}
        </Card>
      </div>
    </>
  );
}