import { useState } from "react";
import { Button, Dialog, Select } from "@/components/ui";
import type { IncidentStatus, UpdateIncidentStatusPayload } from "../types";

type UpdateIncidentStatusDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  currentStatus: IncidentStatus;
  onClose: () => void;
  onSubmit: (payload: UpdateIncidentStatusPayload) => void;
};

const statusLabels: Record<IncidentStatus, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En Progreso",
  ESCALATED: "Escalado",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

// Transiciones válidas según el backend
const validTransitions: Record<IncidentStatus, IncidentStatus[]> = {
  OPEN: ["IN_PROGRESS", "ESCALATED", "CLOSED"],
  IN_PROGRESS: ["ESCALATED", "RESOLVED", "CLOSED"],
  ESCALATED: ["IN_PROGRESS", "RESOLVED", "CLOSED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [], // Estado final
};

export function UpdateIncidentStatusDialog({
  open,
  isSubmitting,
  currentStatus,
  onClose,
  onSubmit,
}: UpdateIncidentStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<IncidentStatus | "">("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newStatus || newStatus === currentStatus) {
      return;
    }

    onSubmit({ status: newStatus as IncidentStatus });
    setNewStatus("");
  };

  const availableTransitions = validTransitions[currentStatus];

  return (
    <Dialog open={open} title="Cambiar Estado de Incidencia" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <p className="text-sm text-blue-900">
            Estado actual:{" "}
            <span className="font-semibold">{statusLabels[currentStatus]}</span>
          </p>
        </div>

        {availableTransitions.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4">
            Este incidente está en estado final y no puede cambiar.
          </p>
        ) : (
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nuevo Estado
            </label>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
              disabled={isSubmitting}
            >
              <option value="">Seleccionar estado...</option>
              {availableTransitions.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || !newStatus || availableTransitions.length === 0
            }
          >
            {isSubmitting ? "Actualizando..." : "Actualizar Estado"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
