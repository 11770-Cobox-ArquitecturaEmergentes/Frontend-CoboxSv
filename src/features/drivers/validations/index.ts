import type { CreateDriverPayload } from '../types';

export function validateCreateDriver(payload: CreateDriverPayload): string | null {
  const email = payload.email.trim();
  const licenceNumber = payload.licenceNumber.trim();

  if (!email) return 'El email es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un email valido.';
  if (!licenceNumber) return 'La licencia es obligatoria.';
  if (licenceNumber.length < 9 || licenceNumber.length > 10) {
    return 'La licencia debe tener entre 9 y 10 caracteres.';
  }

  return null;
}
