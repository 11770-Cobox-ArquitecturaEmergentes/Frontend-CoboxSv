import type { CreateRoutePayload } from '../types';

export function validateCreateRoute(payload: CreateRoutePayload): string | null {
  const title = payload.title.trim();
  if (!title) return 'El titulo de la ruta es obligatorio.';
  if (title.length < 2 || title.length > 50) return 'El titulo debe tener entre 2 y 50 caracteres.';
  return null;
}

export function validatePositiveId(value: string, label: string): string | null {
  const numericValue = Number(value);
  if (!value) return `${label} es obligatorio.`;
  if (!Number.isInteger(numericValue) || numericValue <= 0) return `${label} debe ser un numero positivo.`;
  return null;
}
