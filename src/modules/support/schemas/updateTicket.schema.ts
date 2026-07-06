import { z } from 'zod';

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const updateTicketSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category: z.enum(['LOGIN', 'GPS', 'CAMERA', 'SYNCHRONIZATION', 'APPLICATION_ERROR', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  assignedTo: z.string().refine((v) => v === '' || uuidRegex.test(v), 'UUID inválido').nullable(),
});

export type UpdateTicketFormValues = z.infer<typeof updateTicketSchema>;