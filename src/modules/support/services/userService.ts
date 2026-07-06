import { supportApi } from './ticketService';
import type { SupportUser } from '../types';

function ensureArray<T>(value: unknown, resourceName: string): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const rec = value as Record<string, unknown>;
    if (Array.isArray(rec.value)) return rec.value as T[];
    if (Array.isArray(rec.data)) return rec.data as T[];
  }
  throw new Error(`Respuesta inválida para ${resourceName}: se esperaba un arreglo.`);
}

type BackendUserRaw = {
  id: string | number;
  name?: string;
  fullName?: string;
  email?: string;
  username?: string;
};

function toUser(raw: BackendUserRaw): SupportUser {
  const name = raw.name ?? raw.fullName ?? raw.username ?? raw.email ?? `Usuario ${raw.id}`;
  return {
    id: String(raw.id),
    name,
    email: raw.email ?? '',
  };
}

export const userService = {
  async getUsers(): Promise<SupportUser[]> {
    const response = await supportApi.get<unknown>('/api/v1/users');
    const list = ensureArray<BackendUserRaw>(response.data, 'usuarios');
    return list.map(toUser);
  },
};