import { z } from 'zod';

export const driverSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido'),
  license: z.string().min(4, 'La licencia es requerida'),
  status: z.enum(['available', 'assigned', 'offline']),
});
