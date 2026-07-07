import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, Eye } from 'lucide-react';
import { Button, Card, Input, Skeleton } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import { DegradedSectionsBanner, PageHeader } from '@/components/common';
import { useEvidenceAnalyses } from '../hooks';
import type {
  EvidenceAnalysis,
  EvidenceAnalysisFilters,
  EvidenceAnalysisStatus,
} from '../types';
import { EvidenceAnalysisStatusBadge, EvidenceAnalysisDetailPanel } from '../components';

const columnHelper = createColumnHelper<EvidenceAnalysis>();

const statusOptions: EvidenceAnalysisStatus[] = [
  'PENDING',
  'PROCESSED',
  'FLAGGED',
  'REJECTED',
];

const toFilterNumber = (v: string): number | undefined => {
  const n = Number(v?.trim());
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export function EvidenceAnalysesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [driverIdInput, setDriverIdInput] = useState('');
  const [routeIdInput, setRouteIdInput] = useState('');
  const [orderIdInput, setOrderIdInput] = useState('');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  const filters = useMemo<EvidenceAnalysisFilters>(
    () => ({
      status: (statusFilter || undefined) as EvidenceAnalysisStatus | undefined,
      driverId: toFilterNumber(driverIdInput),
      routeId: toFilterNumber(routeIdInput),
      orderId: toFilterNumber(orderIdInput),
    }),
    [statusFilter, driverIdInput, routeIdInput, orderIdInput],
  );

  const query = useEvidenceAnalyses(filters);
  const summary = query.data;

  const analyses = useMemo<EvidenceAnalysis[]>(() => summary?.analyses ?? [], [summary]);

  const activeAnalysis = useMemo(
    () => analyses.find((a) => a.analysisId === selectedAnalysisId) ?? null,
    [analyses, selectedAnalysisId],
  );

  const columns = [
    columnHelper.accessor('analysisId', {
      header: 'ID',
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue().slice(0, 8)}...</span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Estado',
      cell: (info) => <EvidenceAnalysisStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('driverName', {
      header: 'Conductor',
      cell: (info) => {
        const row = info.row.original;
        const value = row.driverName ?? (row.driverId ? `Conductor #${row.driverId}` : '-');
        return <span className="text-sm text-gray-600">{value}</span>;
      },
    }),
    columnHelper.accessor('routeTitle', {
      header: 'Ruta',
      cell: (info) => {
        const row = info.row.original;
        const value = row.routeTitle ?? (row.routeId ? `Ruta #${row.routeId}` : '-');
        return <span className="text-sm text-gray-600">{value}</span>;
      },
    }),
    columnHelper.accessor('vehiclePlate', {
      header: 'Vehículo',
      cell: (info) => {
        const row = info.row.original;
        const value = row.vehiclePlate ?? (row.vehicleId ? `Vehículo #${row.vehicleId}` : '-');
        return <span className="text-sm text-gray-600">{value}</span>;
      },
    }),
    columnHelper.accessor('orderLabel', {
      header: 'Orden',
      cell: (info) => {
        const row = info.row.original;
        const value = row.orderLabel ?? (row.orderId ? `Orden #${row.orderId}` : '-');
        return <span className="text-sm text-gray-600">{value}</span>;
      },
    }),
    columnHelper.accessor('detectedLabels', {
      header: 'Etiquetas',
      cell: (info) => {
        const labels = info.getValue() ?? [];
        return (
          <span className="text-sm text-gray-600 truncate block max-w-xs">
            {labels.length > 0 ? labels.join(', ') : '-'}
          </span>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Creado',
      cell: (info) => (
        <span className="text-sm text-gray-600">
          {new Date(info.getValue()).toLocaleString()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <button
          onClick={() => setSelectedAnalysisId(info.row.original.analysisId)}
          className="text-blue-600 hover:text-blue-900 p-1"
          title="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: analyses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (query.isError) {
    return (
      <ApiErrorState
        title="Error al cargar análisis"
        message="No pudimos cargar la lista de análisis de evidencia."
        onRetry={() => query.refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Análisis de Evidencia"
        description="Resultados de análisis de evidencia por IA SmartVision"
      />

      <div className="px-4 md:px-8 py-6 space-y-6">
        <DegradedSectionsBanner sections={summary?.degradedSections} />

        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-48">
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Estado
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-40">
              <label
                htmlFor="driver-id-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Conductor ID
              </label>
              <Input
                id="driver-id-filter"
                type="number"
                min={1}
                placeholder="ID"
                value={driverIdInput}
                onChange={(e) => setDriverIdInput(e.target.value)}
              />
            </div>

            <div className="w-full md:w-40">
              <label
                htmlFor="route-id-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ruta ID
              </label>
              <Input
                id="route-id-filter"
                type="number"
                min={1}
                placeholder="ID"
                value={routeIdInput}
                onChange={(e) => setRouteIdInput(e.target.value)}
              />
            </div>

            <div className="w-full md:w-40">
              <label
                htmlFor="order-id-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Orden ID
              </label>
              <Input
                id="order-id-filter"
                type="number"
                min={1}
                placeholder="ID"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setStatusFilter('');
                setDriverIdInput('');
                setRouteIdInput('');
                setOrderIdInput('');
              }}
            >
              Limpiar
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left font-semibold text-gray-700"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {query.isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ) : analyses.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-8 text-center">
                      <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No hay análisis de evidencia para mostrar</p>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {activeAnalysis ? (
        <EvidenceAnalysisDetailPanel
          analysis={activeAnalysis}
          onClose={() => setSelectedAnalysisId(null)}
        />
      ) : null}
    </div>
  );
}