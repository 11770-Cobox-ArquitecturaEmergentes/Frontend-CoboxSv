import { z } from 'zod';

export const vehicleSchema = z.object({
  plate: z.string().min(3, 'La matricula es requerida'),
  type: z.string().min(2, 'El tipo es requerido'),
  capacity: z.coerce.number().positive('La capacidad debe ser mayor a cero'),
  status: z.enum(['operational', 'maintenance', 'out_of_service']),
  year: z.coerce.number().min(1990).max(2100),
  brand: z.string().min(2, 'La marca es requerida'),
  model: z.string().min(1, 'El modelo es requerido'),
});
