import { Badge } from '@/components/ui';
import type { EvidenceAnalysisStatus } from '../types';

const labelByStatus: Record<EvidenceAnalysisStatus, string> = {
  PENDING: 'Pendiente',
  PROCESSED: 'Procesada',
  FLAGGED: 'Marcada',
  REJECTED: 'Rechazada',
};

const classByStatus: Record<EvidenceAnalysisStatus, string> = {
  PENDING: 'bg-slate-100 text-slate-700 border border-slate-200',
  PROCESSED: 'bg-[#DFF6F1] text-[#0F766E] border border-teal-200',
  FLAGGED: 'bg-amber-50 text-amber-700 border border-amber-200',
  REJECTED: 'bg-red-50 text-[#EF4444] border border-red-200',
};

type EvidenceAnalysisStatusBadgeProps = {
  status: EvidenceAnalysisStatus;
};

export function EvidenceAnalysisStatusBadge({ status }: EvidenceAnalysisStatusBadgeProps) {
  return <Badge className={classByStatus[status]}>{labelByStatus[status]}</Badge>;
}