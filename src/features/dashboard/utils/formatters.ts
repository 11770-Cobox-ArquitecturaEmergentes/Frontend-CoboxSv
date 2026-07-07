const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  AVAILABLE: 'Disponible',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Completado',
  DELIVERED: 'Entregado',
  ESCALATED: 'Escalado',
  IN_PROGRESS: 'En progreso',
  IN_TRANSIT: 'En transito',
  OPEN: 'Abierto',
  PENDING: 'Pendiente',
  READY_FOR_DISPATCH: 'Listo para despacho',
  SCHEDULED: 'Programado',
};

export function formatStatusLabel(value: string | null | undefined) {
  if (!value) return 'Sin estado';
  return STATUS_LABELS[value] ?? value.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatWeight(value: number | null | undefined) {
  if (value == null) return 'Sin peso';
  return `${value.toLocaleString('es-PE')} kg`;
}

export function formatCurrency(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount == null) return 'Sin costo';
  try {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency ?? 'PEN',
    }).format(amount);
  } catch {
    return `${amount.toLocaleString('es-PE')} ${currency ?? 'PEN'}`;
  }
}
