import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { EvidenceAnalysisStatusBadge } from './EvidenceAnalysisStatusBadge';
import type { EvidenceAnalysis } from '../types';

type EvidenceAnalysisDetailPanelProps = {
  analysis: EvidenceAnalysis;
  onClose: () => void;
};

export function EvidenceAnalysisDetailPanel({
  analysis,
  onClose,
}: EvidenceAnalysisDetailPanelProps) {
  const driver = analysis.driverName ?? (analysis.driverId ? `Conductor #${analysis.driverId}` : '-');
  const route = analysis.routeTitle ?? (analysis.routeId ? `Ruta #${analysis.routeId}` : '-');
  const vehicle =
    analysis.vehiclePlate ?? (analysis.vehicleId ? `Vehículo #${analysis.vehicleId}` : '-');
  const order = analysis.orderLabel ?? (analysis.orderId ? `Orden #${analysis.orderId}` : '-');
  const confidence =
    analysis.aiConfidence != null ? `${Math.round(analysis.aiConfidence * 100)}%` : '-';
  const labels = analysis.detectedLabels ?? [];

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-40 overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">Detalles de Análisis</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <p className="text-xs text-gray-500 font-medium">ID del Análisis</p>
          <p className="text-sm font-mono text-gray-900 mt-1 break-all">{analysis.analysisId}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium">Estado</p>
          <div className="mt-2">
            <EvidenceAnalysisStatusBadge status={analysis.status} />
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium">Conductor</p>
          <p className="text-sm text-gray-900 mt-1">{driver}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium">Ruta</p>
          <p className="text-sm text-gray-900 mt-1">{route}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium">Vehículo</p>
          <p className="text-sm text-gray-900 mt-1">{vehicle}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium">Orden</p>
          <p className="text-sm text-gray-900 mt-1">{order}</p>
        </div>

        {labels.length > 0 ? (
          <div>
            <p className="text-xs text-gray-500 font-medium">Etiquetas detectadas</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {labels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <p className="text-xs text-gray-500 font-medium">Resumen IA</p>
          <p className="text-sm text-gray-900 mt-1">
            {analysis.aiSummary ?? 'Sin resumen disponible'}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium">Confianza IA</p>
          <p className="text-sm text-gray-900 mt-1">{confidence}</p>
        </div>

        {analysis.thumbnailUrl ? (
          <div>
            <p className="text-xs text-gray-500 font-medium">Miniatura de evidencia</p>
            <img
              src={analysis.thumbnailUrl}
              alt="Miniatura de evidencia"
              className="mt-2 w-full rounded-lg border border-gray-200 object-cover"
            />
          </div>
        ) : null}

        <div>
          <p className="text-xs text-gray-500 font-medium">Datos de análisis</p>
          <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto max-h-64 mt-2">
            {JSON.stringify(analysis.analysisData ?? {}, null, 2)}
          </pre>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium">Creado</p>
          <p className="text-sm text-gray-900 mt-1">
            {new Date(analysis.createdAt).toLocaleString()}
          </p>
        </div>

        {analysis.processedAt ? (
          <div>
            <p className="text-xs text-gray-500 font-medium">Procesado</p>
            <p className="text-sm text-gray-900 mt-1">
              {new Date(analysis.processedAt).toLocaleString()}
            </p>
          </div>
        ) : null}

        {analysis.evidenceUrl ? (
          <div className="pt-4 border-t">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => window.open(analysis.evidenceUrl!, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir evidencia
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}