import { Badge } from '@/components/ui';
import type { IncidentSeverity } from '../types';

type IncidentSeverityBadgeProps = {
  severity: IncidentSeverity;
};

const severityLabels: Record<IncidentSeverity, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};

const severityClasses: Record<IncidentSeverity, string> = {
  LOW: 'bg-slate-100 text-slate-700 border border-slate-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
  HIGH: 'bg-red-50 text-red-700 border border-red-200',
};

export function IncidentSeverityBadge({ severity }: IncidentSeverityBadgeProps) {
  return (
    <Badge className={severityClasses[severity]}>
      {severityLabels[severity]}
    </Badge>
  );
}
