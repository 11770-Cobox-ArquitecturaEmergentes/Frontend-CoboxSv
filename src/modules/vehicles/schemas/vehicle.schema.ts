import { z } from 'zod';

export const vehicleSchema = z.object({
  plate: z.string().min(3, 'La matricula es requerida'),
  capacity: z.coerce.number().positive('La capacidad debe ser mayor a cero'),
  status: z.enum(['operational', 'maintenance', 'out_of_service']),
});
