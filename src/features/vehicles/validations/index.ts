import type { CreateVehiclePayload } from '../types';

export function validateCreateVehicle(payload: CreateVehiclePayload): string | null {
  const plateNumber = payload.plateNumber.trim();
  if (!plateNumber) return 'La placa es obligatoria.';
  if (plateNumber.length < 2 || plateNumber.length > 50) return 'La placa debe tener entre 2 y 50 caracteres.';
  if (!Number.isFinite(payload.capacityKg) || payload.capacityKg <= 0) return 'La capacidad debe ser un numero positivo.';
  return null;
}
