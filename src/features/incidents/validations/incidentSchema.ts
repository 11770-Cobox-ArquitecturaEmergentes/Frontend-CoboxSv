import { z } from "zod";
import type { IncidentSeverity, IncidentStatus } from "../types";

/**
 * Esquema para crear una nueva incidencia
 * Valida los datos antes de enviarlos al backend
 */
export const createIncidentSchema = z.object({
  type: z
    .string()
    .min(1, "El tipo de incidencia es requerido")
    .max(255, "El tipo no puede exceder 255 caracteres"),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(2000, "La descripción no puede exceder 2000 caracteres"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const, {
    errorMap: () => ({
      message: "La severidad debe ser LOW, MEDIUM, HIGH o CRITICAL",
    }),
  }) as z.ZodType<IncidentSeverity>,
  responsibleUserId: z
    .number()
    .int("El ID del responsable debe ser un número entero")
    .positive("El ID del responsable debe ser positivo"),
});

/**
 * Esquema para actualizar el estado de una incidencia
 */
export const updateIncidentStatusSchema = z.object({
  status: z.enum(
    ["OPEN", "IN_PROGRESS", "ESCALATED", "RESOLVED", "CLOSED"] as const,
    {
      errorMap: () => ({
        message:
          "El estado debe ser OPEN, IN_PROGRESS, ESCALATED, RESOLVED o CLOSED",
      }),
    },
  ) as z.ZodType<IncidentStatus>,
});

/**
 * Esquema para asignar un responsable
 */
export const assignResponsibleSchema = z.object({
  responsibleUserId: z
    .number()
    .int("El ID del responsable debe ser un número entero")
    .positive("El ID del responsable debe ser positivo"),
});

// Tipos derivados de los esquemas (útiles para TypeScript)
export type CreateIncidentFormData = z.infer<typeof createIncidentSchema>;
export type UpdateIncidentStatusFormData = z.infer<
  typeof updateIncidentStatusSchema
>;
export type AssignResponsibleFormData = z.infer<typeof assignResponsibleSchema>;
