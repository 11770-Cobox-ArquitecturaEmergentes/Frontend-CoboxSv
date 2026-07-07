import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { AlertStatusBadge } from './AlertStatusBadge';
import { AlertSeverityBadge } from './AlertSeverityBadge';
import type { Alert } from '../types';

type AlertDetailPanelProps = {
  alert: Alert;
  onClose: () => void;
  onAcknowledge: () => void;
  onResolve: (notes: string) => void;
  onCreateIncident: () => void;
  onOpenIncident: () => void;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <div className="text-sm text-gray-900 mt-1">{children}</div>
    </div>
  );
}

function formatDate(iso?: string | null): string {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

export function AlertDetailPanel({
  alert,
  onClose,
  onAcknowledge,
  onResolve,
  onCreateIncident,
  onOpenIncident,
}: AlertDetailPanelProps) {
  const driverLabel = alert.driverName
    ? alert.driverName
    : alert.driverId
      ? `Conductor #${alert.driverId}`
      : '-';
  const routeLabel = alert.routeTitle
    ? alert.routeId
      ? `${alert.routeTitle} (Ruta #${alert.routeId})`
      : alert.routeTitle
    : alert.routeId
      ? `Ruta #${alert.routeId}`
      : '-';
  const vehicleLabel = alert.vehiclePlate
    ? alert.vehicleId
      ? `${alert.vehiclePlate} (Vehículo #${alert.vehicleId})`
      : alert.vehiclePlate
    : alert.vehicleId
      ? `Vehículo #${alert.vehicleId}`
      : '-';
  const orderLabel = alert.orderLabel
    ? alert.orderId
      ? `${alert.orderLabel} (Orden #${alert.orderId})`
      : alert.orderLabel
    : alert.orderId
      ? `Orden #${alert.orderId}`
      : '-';

  const isOpen = alert.status === 'OPEN';
  const isAcknowledged = alert.status === 'ACKNOWLEDGED';
  const isResolved = alert.status === 'RESOLVED';

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-40 overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">Detalle de Alerta</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Cerrar panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <Field label="Alerta ID">
          <span className="font-mono text-xs break-all">{alert.alertId}</span>
        </Field>

        <Field label="Estado">
          <AlertStatusBadge status={alert.status} />
        </Field>

        <Field label="Severidad">
          <AlertSeverityBadge severity={alert.severity} />
        </Field>

        <Field label="Conductor">{driverLabel}</Field>
        <Field label="Ruta">{routeLabel}</Field>
        <Field label="Vehículo">{vehicleLabel}</Field>
        <Field label="Orden">{orderLabel}</Field>

        <Field label="Evidencia">
          {alert.evidenceUrl ? (
            <a
              href={alert.evidenceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#0F766E] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir evidencia
            </a>
          ) : (
            '-'
          )}
        </Field>

        <Field label="Resumen del análisis">
          <p className="text-sm text-gray-900 whitespace-pre-wrap">
            {alert.analysisSummary ?? 'Sin resumen de análisis disponible.'}
          </p>
        </Field>

        <Field label="Creada">{formatDate(alert.createdAt)}</Field>
        <Field label="Reconocida">{formatDate(alert.acknowledgedAt)}</Field>
        <Field label="Resuelta">{formatDate(alert.resolvedAt)}</Field>

        {alert.linkedIncidentId && (
          <div className="rounded-lg border border-[#E2E8F0] bg-[#DFF6F1] p-3 space-y-2">
            <p className="text-xs font-medium text-[#0F766E]">
              Incidente vinculado
            </p>
            <p className="font-mono text-xs text-slate-900 break-all">
              {alert.linkedIncidentId}
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={onOpenIncident}
            >
              Ver incidente
            </Button>
          </div>
        )}
      </div>

      {!isResolved && (
        <div className="p-6 border-t border-[#E2E8F0] space-y-2">
          {isOpen && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={onAcknowledge}
            >
              Reconocer
            </Button>
          )}
          <Button className="w-full" onClick={onCreateIncident}>
            Crear incidente
          </Button>
          {(isOpen || isAcknowledged) && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => onResolve('')}
            >
              Resolver
            </Button>
          )}
        </div>
      )}
    </div>
  );
}