import { z } from 'zod';

export const orderSchema = z.object({
  clientId: z.number().positive('El ID de cliente debe ser positivo'),
  addressLine: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
  postalCode: z.string().min(3, 'El código postal debe tener al menos 3 caracteres'),
  referenceLatitude: z.number().min(-90).max(90),
  referenceLongitude: z.number().min(-180).max(180),
  notes: z.string().optional().default(''),
  weightKg: z.number().positive('El peso debe ser mayor a 0'),
});
