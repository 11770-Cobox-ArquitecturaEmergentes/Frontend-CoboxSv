import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from './types';

export type Option<T extends string> = {
  label: string;
  value: T;
};

export const categoryOptions: Option<TicketCategory>[] = [
  { label: 'Login', value: 'LOGIN' },
  { label: 'GPS', value: 'GPS' },
  { label: 'Cámara', value: 'CAMERA' },
  { label: 'Sincronización', value: 'SYNCHRONIZATION' },
  { label: 'Error de aplicación', value: 'APPLICATION_ERROR' },
  { label: 'Otros', value: 'OTHER' },
];

export const priorityOptions: Option<TicketPriority>[] = [
  { label: 'Baja', value: 'LOW' },
  { label: 'Media', value: 'MEDIUM' },
  { label: 'Alta', value: 'HIGH' },
  { label: 'Crítica', value: 'CRITICAL' },
];

export const statusOptions: Option<TicketStatus>[] = [
  { label: 'Abierto', value: 'OPEN' },
  { label: 'En Proceso', value: 'IN_PROGRESS' },
  { label: 'Resuelto', value: 'RESOLVED' },
  { label: 'Cerrado', value: 'CLOSED' },
];

export const filterStatusOptions: Option<TicketStatus | 'ALL'>[] = [
  { label: 'Todos', value: 'ALL' },
  ...statusOptions,
];

export const filterPriorityOptions: Option<TicketPriority | 'ALL'>[] = [
  { label: 'Todas', value: 'ALL' },
  ...priorityOptions,
];

export const filterCategoryOptions: Option<TicketCategory | 'ALL'>[] = [
  { label: 'Todas', value: 'ALL' },
  ...categoryOptions,
];

export const categoryLabels: Record<TicketCategory, string> = {
  LOGIN: 'Login',
  GPS: 'GPS',
  CAMERA: 'Cámara',
  SYNCHRONIZATION: 'Sincronización',
  APPLICATION_ERROR: 'Error de aplicación',
  OTHER: 'Otros',
};

export const priorityLabels: Record<TicketPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

export const statusLabels: Record<TicketStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En Proceso',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
};

export const priorityBadgeClasses: Record<TicketPriority, string> = {
  LOW: 'bg-[#DFF6F1] text-[#0F766E]',
  MEDIUM: 'bg-[#FEF3C7] text-[#B45309]',
  HIGH: 'bg-orange-50 text-[#F97316]',
  CRITICAL: 'bg-red-50 text-[#EF4444]',
};

export const statusBadgeClasses: Record<TicketStatus, string> = {
  OPEN: 'bg-blue-50 text-[#3B82F6]',
  IN_PROGRESS: 'bg-orange-50 text-[#F97316]',
  RESOLVED: 'bg-[#DFF6F1] text-[#0F766E]',
  CLOSED: 'bg-slate-100 text-[#64748B]',
};

export const categoryBadgeClasses: Record<TicketCategory, string> = {
  LOGIN: 'bg-indigo-50 text-[#6366F1]',
  GPS: 'bg-emerald-50 text-[#10B981]',
  CAMERA: 'bg-purple-50 text-[#8B5CF6]',
  SYNCHRONIZATION: 'bg-cyan-50 text-[#06B6D4]',
  APPLICATION_ERROR: 'bg-red-50 text-[#EF4444]',
  OTHER: 'bg-slate-100 text-[#64748B]',
};

export const ticketStatusFlow: TicketStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
];

export const ticketsQueryKey = ['tickets'] as const;