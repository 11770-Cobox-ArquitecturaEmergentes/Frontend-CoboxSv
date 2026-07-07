import { useState } from 'react';
import { Activity } from 'lucide-react';
import { ApiErrorState } from '@/components/shared';
import { EmptyState, PageHeader } from '@/components/common';
import { Card, Skeleton } from '@/components/ui';
import { useReportMetrics } from '../hooks';
import type {
  IncidentReportMetric,
  ReportCategory,
  ReportMetric,
} from '../types';

const tabs: { value: ReportCategory; label: string }[] = [
  { value: 'incidents', label: 'Incidentes' },
  { value: 'operations', label: 'Operaciones' },
  { value: 'smartvision', label: 'SmartVision IA' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'fleet', label: 'Flota' },
  { value: 'deliveries', label: 'Entregas' },
];

type Metric = IncidentReportMetric | ReportMetric;

function ReportMetricsGrid({
  metrics,
  isLoading,
  isError,
  onRetry,
}: {
  metrics: Metric[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isError) {
    return <ApiErrorState title="No se pudo cargar el reporte" onRetry={onRetry} />;
  }
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
      </div>
    );
  }
  if (metrics.length === 0) {
    return (
      <EmptyState
        title="Sin métricas disponibles"
        description="Todavía no se registran métricas para este reporte."
      />
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => (
        <Card key={m.id} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#DFF6F1] text-[#0F766E] rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 capitalize">
                {m.metricName.replace(/_/g, ' ').toLowerCase()}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {String(m.metricValue)}
              </h3>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Última actualización: {new Date(m.aggregatedAt).toLocaleString()}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportCategory>('incidents');

  const metricsHook = useReportMetrics(activeTab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        description="Métricas operacionales para el gestor CoBox."
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={
              activeTab === tab.value
                ? 'bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm font-semibold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-[#E2E8F0] px-4 py-2 rounded-lg text-sm font-semibold'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ReportMetricsGrid
        metrics={(metricsHook.data ?? []) as Metric[]}
        isLoading={metricsHook.isLoading}
        isError={metricsHook.isError}
        onRetry={() => void metricsHook.refetch()}
      />
    </div>
  );
}