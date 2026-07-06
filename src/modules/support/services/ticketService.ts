import axios from 'axios';
import type {
  CreateTicketPayload,
  Ticket,
  UpdateTicketPayload,
} from '@/modules/support/types';

const TOKEN_KEY = 'cobox_token';

export const supportApi = axios.create({
  baseURL: import.meta.env.VITE_SUPPORT_API_URL ?? 'http://localhost:8084',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status < 400,
});

supportApi.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    /* ignore */
  }
  return config;
});

function ensureArray<T>(value: unknown, resourceName: string): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const rec = value as Record<string, unknown>;
    if (Array.isArray(rec.value)) return rec.value as T[];
    if (Array.isArray(rec.data)) return rec.data as T[];
  }
  throw new Error(`Respuesta inválida para ${resourceName}: se esperaba un arreglo.`);
}

function unwrap<T>(value: unknown): T {
  if (value && typeof value === 'object') {
    const rec = value as Record<string, unknown>;
    if ('data' in rec && rec.data !== undefined) return rec.data as T;
  }
  return value as T;
}

export type BackendTicket = Ticket;

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    const response = await supportApi.get<unknown>('/api/v1/tickets');
    return ensureArray<Ticket>(response.data, 'tickets');
  },

  async getById(id: string): Promise<Ticket> {
    const response = await supportApi.get<unknown>(`/api/v1/tickets/${id}`);
    return unwrap<Ticket>(response.data);
  },

  async create(payload: CreateTicketPayload): Promise<Ticket> {
    const response = await supportApi.post<unknown>('/api/v1/tickets', payload);
    return unwrap<Ticket>(response.data);
  },

  async update(id: string, payload: UpdateTicketPayload): Promise<Ticket> {
    const response = await supportApi.put<unknown>(`/api/v1/tickets/${id}`, payload);
    return unwrap<Ticket>(response.data);
  },

  async remove(id: string): Promise<void> {
    await supportApi.delete(`/api/v1/tickets/${id}`);
  },

  async getByUser(userId: string): Promise<Ticket[]> {
    const response = await supportApi.get<unknown>(`/api/v1/tickets/user/${userId}`);
    return ensureArray<Ticket>(response.data, 'tickets del usuario');
  },

  async getByStatus(status: string): Promise<Ticket[]> {
    const response = await supportApi.get<unknown>(`/api/v1/tickets/status/${status}`);
    return ensureArray<Ticket>(response.data, 'tickets por estado');
  },

  async getByPriority(priority: string): Promise<Ticket[]> {
    const response = await supportApi.get<unknown>(`/api/v1/tickets/priority/${priority}`);
    return ensureArray<Ticket>(response.data, 'tickets por prioridad');
  },

  async getByCategory(category: string): Promise<Ticket[]> {
    const response = await supportApi.get<unknown>(`/api/v1/tickets/category/${category}`);
    return ensureArray<Ticket>(response.data, 'tickets por categoría');
  },
};