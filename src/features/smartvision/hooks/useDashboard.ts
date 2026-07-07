import { useMemo } from 'react';
import { Activity, AlertTriangle, BrainCircuit, Clock, Eye, Shield, ShieldAlert, TriangleAlert } from 'lucide-react';
import type { AiAlert, Category, CategoryColor, KpiColor, KpiData } from '../types';
import { useSmartVisionAlerts } from './useSmartVisionAlerts';

const severityWeight: Record<AiAlert['severity'], number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

const severityColor: Record<AiAlert['severity'], CategoryColor> = {
  LOW: 'yellow',
  MEDIUM: 'orange',
  HIGH: 'red',
};

function humanize(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatRelativeTime(value?: string) {
  if (!value) return 'Sin alertas registradas';
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'Fecha no disponible';

  const diffMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (diffMinutes < 1) return 'Hace menos de 1 min';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.round(diffHours / 24);
  return `Hace ${diffDays} d`;
}

function buildCategories(alerts: AiAlert[]): Category[] {
  const grouped = alerts.reduce<Record<string, { count: number; severity: AiAlert['severity'] }>>((acc, alert) => {
    const current = acc[alert.type];
    if (!current) {
      acc[alert.type] = { count: 1, severity: alert.severity };
      return acc;
    }

    current.count += 1;
    if (severityWeight[alert.severity] > severityWeight[current.severity]) {
      current.severity = alert.severity;
    }
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([type, data]) => ({
      id: type,
      name: humanize(type),
      count: data.count,
      color: severityColor[data.severity],
      icon: type.includes('FRAUD') || type.includes('MISMATCH') ? ShieldAlert : AlertTriangle,
    }))
    .sort((left, right) => right.count - left.count);
}

function buildKpis(alerts: AiAlert[]): KpiData[] {
  const openAlerts = alerts.filter((alert) => alert.status === 'OPEN');
  const highSeverity = alerts.filter((alert) => alert.severity === 'HIGH');
  const reviewAlerts = alerts.filter((alert) =>
    ['EVIDENCE_REVIEW_REQUIRED', 'EVIDENCE_RECAPTURE_REQUIRED', 'EVIDENCE_CONTEXT_MISMATCH'].includes(alert.type),
  );
  const latestAlert = [...alerts].sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];
  const safetyScore = Math.max(0, 100 - highSeverity.length * 15 - openAlerts.length * 3);
  const safetyColor: KpiColor = safetyScore >= 85 ? 'green' : safetyScore >= 65 ? 'orange' : 'red';

  return [
    {
      id: 'security',
      title: 'Nivel de seguridad',
      value: `${safetyScore}%`,
      subtitle: alerts.length === 0 ? 'Sin alertas registradas' : 'Calculado por severidad abierta',
      icon: Shield,
      progress: safetyScore,
      color: safetyColor,
    },
    {
      id: 'open-alerts',
      title: 'Alertas abiertas',
      value: openAlerts.length,
      subtitle: `${alerts.length} alertas totales`,
      icon: Activity,
      color: openAlerts.length > 0 ? 'orange' : 'green',
    },
    {
      id: 'high-severity',
      title: 'Severidad alta',
      value: highSeverity.length,
      subtitle: 'Prioridad operativa',
      icon: TriangleAlert,
      color: highSeverity.length > 0 ? 'red' : 'green',
    },
    {
      id: 'review-required',
      title: 'Revisión IA',
      value: reviewAlerts.length,
      subtitle: formatRelativeTime(latestAlert?.createdAt),
      icon: alerts.length > 0 ? Eye : BrainCircuit,
      color: reviewAlerts.length > 0 ? 'orange' : 'default',
    },
    {
      id: 'latest',
      title: 'Última alerta',
      value: latestAlert ? humanize(latestAlert.severity) : '-',
      subtitle: latestAlert ? humanize(latestAlert.type) : 'Esperando resultados de IA',
      icon: Clock,
      color: latestAlert?.severity === 'HIGH' ? 'red' : latestAlert?.severity === 'MEDIUM' ? 'orange' : 'default',
    },
  ];
}

export function useDashboard() {
  const alertsQuery = useSmartVisionAlerts();
  const alerts = alertsQuery.data ?? [];
  const kpis = useMemo(() => buildKpis(alerts), [alerts]);
  const categories = useMemo(() => buildCategories(alerts), [alerts]);

  return {
    kpis,
    alerts,
    categories,
    isLoading: alertsQuery.isLoading,
    isFetching: alertsQuery.isFetching,
    isError: alertsQuery.isError,
    refetch: alertsQuery.refetch,
  };
}
