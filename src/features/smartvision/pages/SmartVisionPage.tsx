import { useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { BrainCircuit, RefreshCw, SearchX } from 'lucide-react';
import { ApiErrorState } from '@/components/shared';
import { Button, Card, Select, Skeleton } from '@/components/ui';
import { cn } from '@/utils';
import { AiAlertCard, CategoryProgress, StatsCard } from '../components';
import { useDashboard, useEvidenceAnalysis, useSmartVisionAlerts } from '../hooks';
import type { AiAlert, AlertStatus, EvidenceAnalysis } from '../types';

const statusOptions: Array<{ value: '' | AlertStatus; label: string }> = [
  { value: '', label: 'Todas' },
  { value: 'OPEN', label: 'Abiertas' },
  { value: 'ACKNOWLEDGED', label: 'Reconocidas' },
  { value: 'RESOLVED', label: 'Resueltas' },
];

const analysisLabels: Record<EvidenceAnalysis['status'], string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  COMPLETED: 'Completada',
  FAILED: 'Fallida',
  REVIEW_REQUIRED: 'Requiere revision',
  RECAPTURE_REQUIRED: 'Requiere recaptura',
  FRAUD_SUSPECTED: 'Fraude sospechado',
  DEGRADED: 'Degradada',
};

function SmartVisionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatScore(value: number | null) {
  if (value === null || value === undefined) return '-';
  const normalized = value <= 1 ? value * 100 : value;
  return `${Math.round(normalized)}%`;
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-[#9CA3AF]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-[#111827]">{value ?? '-'}</dd>
    </div>
  );
}

function AnalysisDetail({
  alert,
  onClose,
}: {
  alert: AiAlert;
  onClose: () => void;
}) {
  const analysisQuery = useEvidenceAnalysis(alert.clientEvidenceId);
  const analysis = analysisQuery.data;
  const notFound = isAxiosError(analysisQuery.error) && analysisQuery.error.response?.status === 404;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Analisis de evidencia</h2>
          <p className="mt-1 break-all text-sm text-[#6B7280]">{alert.clientEvidenceId}</p>
        </div>
        <Button variant="ghost" onClick={onClose} className="h-9 px-3">
          Cerrar
        </Button>
      </div>

      {analysisQuery.isLoading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-32" />
          <Skeleton className="h-20" />
        </div>
      ) : null}

      {analysisQuery.isError ? (
        <div className="mt-5 rounded-lg border border-dashed border-[#E5E7EB] p-4 text-sm text-[#6B7280]">
          {notFound
            ? 'La alerta existe, pero el analisis aun no esta disponible para esta evidencia.'
            : 'No se pudo cargar el analisis de esta evidencia.'}
        </div>
      ) : null}

      {analysis ? (
        <div className="mt-5 space-y-5">
          <div className="rounded-lg border border-[#E5E7EB] bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-[#64748B]">Estado IA</p>
                <p className="mt-1 text-base font-semibold text-[#111827]">{analysisLabels[analysis.status]}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-[#64748B]">Proveedor</p>
                <p className="mt-1 text-base font-semibold text-[#111827]">{analysis.provider ?? '-'}</p>
              </div>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailRow label="Conductor" value={analysis.driverId ? `#${analysis.driverId}` : null} />
            <DetailRow label="Orden" value={analysis.orderId ? `#${analysis.orderId}` : null} />
            <DetailRow label="Ruta" value={analysis.routeId ? `#${analysis.routeId}` : null} />
            <DetailRow label="Tipo" value={analysis.evidenceType} />
            <DetailRow label="Confianza" value={formatScore(analysis.confidenceScore)} />
            <DetailRow label="Fraude" value={formatScore(analysis.fraudScore)} />
            <DetailRow label="Creado" value={formatDateTime(analysis.createdAt)} />
            <DetailRow label="Completado" value={formatDateTime(analysis.completedAt)} />
          </dl>

          <div>
            <p className="text-xs font-medium uppercase text-[#9CA3AF]">Resumen</p>
            <p className="mt-2 rounded-lg border border-[#E5E7EB] bg-white p-3 text-sm text-[#374151]">
              {analysis.validationSummary ?? analysis.failureReason ?? 'Sin resumen registrado.'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-[#9CA3AF]">Objeto S3</p>
            <p className="mt-2 break-all rounded-lg border border-[#E5E7EB] bg-white p-3 text-xs text-[#6B7280]">
              {analysis.objectKey}
            </p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

export function SmartVisionPage() {
  const [statusFilter, setStatusFilter] = useState<'' | AlertStatus>('');
  const [selectedAlert, setSelectedAlert] = useState<AiAlert | null>(null);
  const dashboard = useDashboard();
  const alertsQuery = useSmartVisionAlerts(statusFilter || undefined);
  const alerts = alertsQuery.data ?? [];

  const selectedAlertInList = useMemo(
    () => alerts.find((alert) => alert.alertId === selectedAlert?.alertId) ?? null,
    [alerts, selectedAlert],
  );

  const activeAlert = selectedAlertInList ?? selectedAlert;

  if (dashboard.isLoading && alertsQuery.isLoading) return <SmartVisionSkeleton />;

  if (dashboard.isError || alertsQuery.isError) {
    return (
      <ApiErrorState
        title="No se pudo cargar SmartVision"
        message="Verifica que el gateway exponga /api/v1/ai-validation y que tu sesion tenga token valido."
        onRetry={() => {
          void dashboard.refetch();
          void alertsQuery.refetch();
        }}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-white">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">SmartVision AI</h1>
            <p className="mt-0.5 text-sm text-[#6B7280]">
              Validacion asincronica de evidencias con inteligencia artificial
              {alertsQuery.isFetching || dashboard.isFetching ? ' · Actualizando...' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as '' | AlertStatus);
              setSelectedAlert(null);
            }}
            className="w-full sm:w-44"
            aria-label="Filtrar alertas por estado"
          >
            {statusOptions.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            onClick={() => {
              void dashboard.refetch();
              void alertsQuery.refetch();
            }}
            disabled={alertsQuery.isFetching || dashboard.isFetching}
          >
            <RefreshCw
              className={cn('h-4 w-4', (alertsQuery.isFetching || dashboard.isFetching) && 'animate-spin')}
            />
            Refrescar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboard.kpis.map((kpi, index) => (
          <StatsCard key={kpi.id} kpi={kpi} index={index} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#111827]">Alertas de evidencia</h2>
            <span className="text-sm text-[#6B7280]">{alerts.length} resultados</span>
          </div>

          {alerts.length === 0 ? (
            <Card className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-[#64748B]">
                <SearchX className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111827]">Sin alertas para mostrar</h3>
              <p className="mt-2 max-w-md text-sm text-[#6B7280]">
                Cuando `ai-validation-service` procese evidencias confirmadas, las alertas apareceran aqui.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <AiAlertCard
                  key={alert.alertId}
                  alert={alert}
                  index={index}
                  isSelected={activeAlert?.alertId === alert.alertId}
                  onSelect={setSelectedAlert}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {activeAlert ? (
            <AnalysisDetail alert={activeAlert} onClose={() => setSelectedAlert(null)} />
          ) : (
            <>
              <h2 className="text-lg font-semibold text-[#111827]">Deteccion por categoria</h2>
              <Card className="p-5 shadow-sm">
                <CategoryProgress categories={dashboard.categories} />
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
