/**
 * Sección individual de información parcial/degradada del backend.
 * Compartido por todas las features que consumen endpoints /api/v1/desktop/*
 * ya que el backend puede responder degradando algunas subsecciones (flota,
 * órdenes, mantenimiento, smartvision, etc.) en lugar de fallar toda la llamada.
 */
export type DegradedSection = {
  section: string;
  reason: string;
};