import { z } from "zod";
import type {
  MaintenanceType,
  MaintenancePriority,
  MaintenanceReason,
} from "../types";

/**
 * Esquema para crear orden de mantenimiento
 */
export const createMaintenanceOrderSchema = z.object({
  vehicleId: z.number().int().positive("El ID del vehículo debe ser positivo"),
  maintenanceType: z.enum(["PREVENTIVE", "CORRECTIVE", "PREDICTIVE"] as const, {
    errorMap: () => ({
      message: "El tipo debe ser PREVENTIVE, CORRECTIVE o PREDICTIVE",
    }),
  }) as z.ZodType<MaintenanceType>,
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const, {
    errorMap: () => ({
      message: "La prioridad debe ser LOW, MEDIUM, HIGH o CRITICAL",
    }),
  }) as z.ZodType<MaintenancePriority>,
  reason: z.enum(["SCHEDULED", "BREAKDOWN", "INSPECTION", "OTHER"] as const, {
    errorMap: () => ({
      message: "La razón debe ser SCHEDULED, BREAKDOWN, INSPECTION u OTHER",
    }),
  }) as z.ZodType<MaintenanceReason>,
  openingOdometer: z.number().positive("El odómetro debe ser positivo"),
  scheduledTimelapseDays: z
    .number()
    .int()
    .positive("Los días deben ser positivos"),
  technicianId: z
    .number()
    .int()
    .positive("El ID del técnico debe ser positivo")
    .optional(),
});

/**
 * Esquema para programar orden
 */
export const scheduleMaintenanceOrderSchema = z.object({
  scheduledTimelapseDays: z
    .number()
    .int()
    .positive("Los días deben ser positivos"),
});

/**
 * Esquema para completar orden
 */
export const completeMaintenanceOrderSchema = z.object({
  closingOdometer: z.number().positive("El odómetro debe ser positivo"),
});

/**
 * Esquema para cancelar orden
 */
export const cancelMaintenanceOrderSchema = z.object({
  reason: z
    .string()
    .min(1, "La razón es requerida")
    .max(500, "La razón no puede exceder 500 caracteres"),
});

/**
 * Esquema para registrar trabajo
 */
export const registerJobSchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(2000, "La descripción no puede exceder 2000 caracteres"),
  completed: z.boolean().optional().default(false),
});

/**
 * Esquema para solicitar repuestos
 */
export const requestPartsSchema = z.object({
  partName: z
    .string()
    .min(1, "El nombre del repuesto es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres"),
  quantity: z.number().int().positive("La cantidad debe ser positiva"),
});

/**
 * Esquema para recibir repuestos
 */
export const receivePartsSchema = z.object({
  partsRequestId: z
    .number()
    .int()
    .positive("El ID de solicitud debe ser positivo"),
});

/**
 * Esquema para registrar costo
 */
export const registerCostSchema = z.object({
  amount: z.number().positive("El monto debe ser positivo"),
  currency: z
    .string()
    .min(1, "La moneda es requerida")
    .max(10, "La moneda no puede exceder 10 caracteres"),
});

/**
 * Esquema para regla de mantenimiento
 */
export const maintenanceRuleSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la regla es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres"),
  thresholdKm: z.number().positive("El umbral en km debe ser positivo"),
  thresholdDays: z.number().positive("El umbral en días debe ser positivo"),
});

/**
 * Esquema para crear cronograma
 */
export const createMaintenanceScheduleSchema = z.object({
  vehicleId: z.number().int().positive("El ID del vehículo debe ser positivo"),
  rules: z
    .array(maintenanceRuleSchema)
    .min(1, "Al menos una regla es requerida"),
});

/**
 * Esquema para actualizar reglas
 */
export const updateMaintenanceRulesSchema = z.object({
  rules: z
    .array(maintenanceRuleSchema)
    .min(1, "Al menos una regla es requerida"),
});

// Tipos derivados
export type CreateMaintenanceOrderFormData = z.infer<
  typeof createMaintenanceOrderSchema
>;
export type ScheduleMaintenanceOrderFormData = z.infer<
  typeof scheduleMaintenanceOrderSchema
>;
export type CompleteMaintenanceOrderFormData = z.infer<
  typeof completeMaintenanceOrderSchema
>;
export type CancelMaintenanceOrderFormData = z.infer<
  typeof cancelMaintenanceOrderSchema
>;
export type RegisterJobFormData = z.infer<typeof registerJobSchema>;
export type RequestPartsFormData = z.infer<typeof requestPartsSchema>;
export type ReceivePartsFormData = z.infer<typeof receivePartsSchema>;
export type RegisterCostFormData = z.infer<typeof registerCostSchema>;
export type MaintenanceRuleFormData = z.infer<typeof maintenanceRuleSchema>;
export type CreateMaintenanceScheduleFormData = z.infer<
  typeof createMaintenanceScheduleSchema
>;
export type UpdateMaintenanceRulesFormData = z.infer<
  typeof updateMaintenanceRulesSchema
>;
