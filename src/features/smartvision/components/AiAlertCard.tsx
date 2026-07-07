import { motion } from 'framer-motion';
import { AlertTriangle, Eye, RadioTower, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/utils';
import type { AiAlert, AlertSeverity, AlertStatus } from '../types';

const severityClasses: Record<AlertSeverity, string> = {
  LOW: 'bg-yellow-50 text-[#A16207]',
  MEDIUM: 'bg-amber-50 text-[#D97706]',
  HIGH: 'bg-red-50 text-[#EF4444]',
};

const statusClasses: Record<AlertStatus, string> = {
  OPEN: 'bg-red-50 text-[#EF4444]',
  ACKNOWLEDGED: 'bg-blue-50 text-[#2563EB]',
  RESOLVED: 'bg-emerald-50 text-[#047857]',
};

const severityLabels: Record<AlertSeverity, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};

const statusLabels: Record<AlertStatus, string> = {
  OPEN: 'Abierta',
  ACKNOWLEDGED: 'Reconocida',
  RESOLVED: 'Resuelta',
};

function humanize(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function iconForType(type: string) {
  if (type.includes('MISMATCH') || type.includes('FRAUD')) return ShieldAlert;
  if (type.includes('TELEMETRY')) return RadioTower;
  if (type.includes('REVIEW')) return Eye;
  return AlertTriangle;
}

type AiAlertCardProps = {
  alert: AiAlert;
  index: number;
  isSelected: boolean;
  onSelect: (alert: AiAlert) => void;
};

export function AiAlertCard({ alert, index, isSelected, onSelect }: AiAlertCardProps) {
  const IconComponent = iconForType(alert.type);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ scale: 1.005 }}
      onClick={() => onSelect(alert)}
      className={cn(
        'w-full rounded-lg border bg-white p-4 text-left transition-shadow hover:shadow-md',
        isSelected ? 'border-[#0F766E] ring-2 ring-[#DFF6F1]' : 'border-[#E5E7EB]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              severityClasses[alert.severity],
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#111827]">{humanize(alert.type)}</h3>
            <p className="mt-1 text-sm text-[#6B7280]">{alert.message}</p>
            <p className="mt-2 break-all text-xs text-[#9CA3AF]">Evidencia {alert.clientEvidenceId}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge className={cn('text-xs font-medium', severityClasses[alert.severity])}>
            {severityLabels[alert.severity]}
          </Badge>
          <Badge className={cn('text-xs font-medium', statusClasses[alert.status])}>
            {statusLabels[alert.status]}
          </Badge>
          <span className="text-xs text-[#9CA3AF]">{formatDateTime(alert.createdAt)}</span>
        </div>
      </div>
    </motion.button>
  );
}
