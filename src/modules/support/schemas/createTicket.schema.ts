import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category: z.enum(['LOGIN', 'GPS', 'CAMERA', 'SYNCHRONIZATION', 'APPLICATION_ERROR', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;