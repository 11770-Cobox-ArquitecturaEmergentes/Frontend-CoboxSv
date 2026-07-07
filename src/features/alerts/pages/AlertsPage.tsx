import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Card, Select, Skeleton, useToast } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import {
  DegradedSectionsBanner,
  EmptyState,
  PageHeader,
} from '@/components/common';
import {
  useAcknowledgeAlert,
  useAlerts,
  useCreateIncidentFromAlert,
  useResolveAlert,
} from '../hooks';
import type { Alert, AlertStatus } from '../types';
import {
  AlertStatusBadge,
  AlertSeverityBadge,
  AlertDetailPanel,
  ResolveAlertDialog,
  CreateIncidentFromAlertDialog,
} from '../components';

const columnHelper = createColumnHelper<Alert>();

const statusOptions: { value: '' | AlertStatus; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'OPEN', label: 'Abiertas' },
  { value: 'ACKNOWLEDGED', label: 'Reconocidas' },
  { value: 'RESOLVED', label: 'Resueltas' },
];

export function AlertsPage() {
  const [searchParams] = useSearchParams();
  const queryAlertId = searchParams.get('alertId');
  const [statusFilter, setStatusFilter] = useState<'' | AlertStatus>('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const alertsQuery = useAlerts(statusFilter || undefined);
  const acknowledgeMutation = useAcknowledgeAlert();
  const resolveMutation = useResolveAlert();
  const createIncidentMutation = useCreateIncidentFromAlert();

  const summary = alertsQuery.data;
  const alerts = useMemo(() => summary?.alerts ?? [], [summary]);
  const degradedSections = summary?.degradedSections ?? [];

  const activeAlert = useMemo(() => {
    if (!selectedAlert) return null;
    return alerts.find((a) => a.alertId === selectedAlert.alertId) ?? selectedAlert;
  }, [alerts, selectedAlert]);

  useEffect(() => {
    if (!queryAlertId) return;
    if (selectedAlert) return;
    const found = alerts.find((a) => a.alertId === queryAlertId);
    if (found) setSelectedAlert(found);
  }, [alerts, queryAlertId, selectedAlert]);

  const metrics = useMemo(() => {
    return {
      open: alerts.filter((a) => a.status === 'OPEN').length,
      acknowledged: alerts.filter((a) => a.status === 'ACKNOWLEDGED').length,
      resolved: alerts.filter((a) => a.status === 'RESOLVED').length,
    };
  }, [alerts]);

  const handleAcknowledge = () => {
    if (!activeAlert) return;
    acknowledgeMutation.mutateAsync(activeAlert.alertId).then(() => {
      toast({ title: 'Alerta reconocida', type: 'success' });
    }).catch((err: unknown) => {
      toast({
        title: (err as { message?: string }).message ?? 'Error al reconocer la alerta',
        type: 'error',
      });
    });
  };

  const handleResolveSubmit = (notes: string) => {
    if (!activeAlert) return;
    resolveMutation.mutateAsync(
      { alertId: activeAlert.alertId, payload: { resolutionNotes: notes } },
    ).then(() => {
      setIsResolveOpen(false);
      toast({ title: 'Alerta resuelta correctamente', type: 'success' });
    }).catch((err: unknown) => {
      toast({
        title: (err as { message?: string }).message ?? 'Error al resolver la alerta',
        type: 'error',
      });
    });
  };

  const handleCreateIncidentConfirm = () => {
    if (!activeAlert) return;
    const wasLinkedBefore = Boolean(activeAlert.linkedIncidentId);
    createIncidentMutation.mutateAsync(activeAlert.alertId).then(() => {
      setIsCreateIncidentOpen(false);
      toast(
        wasLinkedBefore
          ? { title: 'Incidente ya vinculado', type: 'success' }
          : { title: 'Incidente creado desde la alerta', type: 'success' },
      );
    }).catch((err: unknown) => {
      toast({
        title:
          (err as { message?: string }).message ??
          'Error al crear el incidente desde la alerta',
        type: 'error',
      });
    });
  };

  const handleOpenIncident = () => {
    if (!activeAlert) return;
    navigate(`/incidents?sourceAlertId=${activeAlert.alertId}`);
  };

  const columns = [
    columnHelper.accessor('alertId', {
      header: 'ID',
      cell: (info) => (
        <span className="font-mono text-xs">
          {info.getValue().slice(0, 8)}...
        </span>
      ),
    }),
    columnHelper.accessor('severity', {
      header: 'Severidad',
      cell: (info) => <AlertSeverityBadge severity={info.getValue()} />,
    }),
    columnHelper.accessor('status', {
      header: 'Estado',
      cell: (info) => <AlertStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('driverName', {
      header: 'Conductor',
      cell: (info) => {
        const row = info.row.original;
        const label = row.driverName
          ? row.driverName
          : row.driverId
            ? `Conductor #${row.driverId}`
            : '-';
        return <span className="text-sm text-gray-600">{label}</span>;
      },
    }),
    columnHelper.accessor('routeTitle', {
      header: 'Ruta',
      cell: (info) => {
        const row = info.row.original;
        const label = row.routeTitle
          ? row.routeId
            ? `${row.routeTitle} (Ruta #${row.routeId})`
            : row.routeTitle
          : row.routeId
            ? `Ruta #${row.routeId}`
            : '-';
        return <span className="text-sm text-gray-600">{label}</span>;
      },
    }),
    columnHelper.accessor('vehiclePlate', {
      header: 'Vehículo',
      cell: (info) => {
        const row = info.row.original;
        const label = row.vehiclePlate
          ? row.vehiclePlate
          : row.vehicleId
            ? `Vehículo #${row.vehicleId}`
            : '-';
        return <span className="text-sm text-gray-600">{label}</span>;
      },
    }),
    columnHelper.accessor('orderLabel', {
      header: 'Orden',
      cell: (info) => {
        const row = info.row.original;
        const label = row.orderLabel
          ? row.orderLabel
          : row.orderId
            ? `Orden #${row.orderId}`
            : '-';
        return <span className="text-sm text-gray-600">{label}</span>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <button
          onClick={() => setSelectedAlert(info.row.original)}
          className="text-[#0F766E] hover:text-[#0b5f59] p-1"
          title="Ver detalle"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: alerts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Alertas IA"
        description="Bandeja de alertas de IA SmartVision"
      />

      <div className="px-4 md:px-8 py-6 space-y-6">
        <DegradedSectionsBanner sections={degradedSections} />

        {!statusFilter && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-red-500">
              <p className="text-xs text-gray-600 font-medium">Abiertas</p>
              <p className="text-2xl font-bold text-red-700">{metrics.open}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber-500">
              <p className="text-xs text-gray-600 font-medium">
                Reconocidas
              </p>
              <p className="text-2xl font-bold text-amber-700">
                {metrics.acknowledged}
              </p>
            </Card>
            <Card className="p-4 border-l-4 border-l-[#0F766E]">
              <p className="text-xs text-gray-600 font-medium">Resueltas</p>
              <p className="text-2xl font-bold text-[#0F766E]">
                {metrics.resolved}
              </p>
            </Card>
          </div>
        )}

        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-64">
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Estado
              </label>
              <Select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as '' | AlertStatus)
                }
                className="w-full"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {alertsQuery.isError && alerts.length === 0 ? (
          <ApiErrorState
            title="Error al cargar alertas"
            message="No pudimos cargar la bandeja de alertas."
            onRetry={() => alertsQuery.refetch()}
          />
        ) : alerts.length === 0 && !alertsQuery.isLoading ? (
          <EmptyState
            title="No hay alertas para mostrar"
            description="Cuando el servicio SmartVision detecte una anomalía aparecerá aquí."
          />
        ) : (
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
                  {alertsQuery.isLoading ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-4">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {activeAlert && (
        <AlertDetailPanel
          alert={activeAlert}
          onClose={() => setSelectedAlert(null)}
          onAcknowledge={handleAcknowledge}
          onResolve={() => setIsResolveOpen(true)}
          onCreateIncident={() => setIsCreateIncidentOpen(true)}
          onOpenIncident={handleOpenIncident}
        />
      )}

      {activeAlert && (
        <>
          <ResolveAlertDialog
            open={isResolveOpen}
            isSubmitting={resolveMutation.isPending}
            onClose={() => setIsResolveOpen(false)}
            onSubmit={handleResolveSubmit}
          />
          <CreateIncidentFromAlertDialog
            open={isCreateIncidentOpen}
            isSubmitting={createIncidentMutation.isPending}
            alreadyLinked={Boolean(activeAlert.linkedIncidentId)}
            linkedIncidentId={activeAlert.linkedIncidentId}
            onClose={() => setIsCreateIncidentOpen(false)}
            onConfirm={handleCreateIncidentConfirm}
          />
        </>
      )}
    </div>
  );
}