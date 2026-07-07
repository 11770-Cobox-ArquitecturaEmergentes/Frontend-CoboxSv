import { Badge } from '@/components/ui';
import type { AlertSeverity } from '../types';

type AlertSeverityBadgeProps = {
  severity: AlertSeverity;
};

const severityLabels: Record<AlertSeverity, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

const severityClasses: Record<AlertSeverity, string> = {
  LOW: 'bg-slate-100 text-slate-700 border border-slate-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
  HIGH: 'bg-red-50 text-red-700 border border-red-200',
  CRITICAL: 'bg-purple-50 text-purple-700 border border-purple-200',
};

export function AlertSeverityBadge({ severity }: AlertSeverityBadgeProps) {
  return (
    <Badge className={severityClasses[severity]}>
      {severityLabels[severity]}
    </Badge>
  );
}