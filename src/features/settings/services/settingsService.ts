import { fleetApi } from '@/services';
import type { UpdateSettingsPayload, UserSettings } from '../types';

async function fetchAndNormalize(): Promise<UserSettings> {
  const { data } = await fleetApi.get<{
    id: string;
    email?: string | null;
    name?: string | null;
    locale?: string | null;
  }>('/api/v1/users/me');
  return { email: data.email ?? null, name: data.name ?? null, locale: data.locale ?? null };
}

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    return fetchAndNormalize();
  },
  async updateSettings(payload: UpdateSettingsPayload): Promise<UserSettings> {
    const { data } = await fleetApi.put<UpdateSettingsPayload>('/api/v1/users/me', payload);
    return { locale: data.locale ?? null, name: data.name ?? null };
  },
};