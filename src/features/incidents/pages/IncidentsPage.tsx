import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  AlertTriangle,
  Clock,
  Eye,
  Plus,
  Search,
  X,
  MapPin,
  User,
  Layers,
  FileText,
  FileBadge,
} from 'lucide-react';
import { Badge, Button, Card, Input, Skeleton, useToast } from '@/components/ui';
import { ApiErrorState } from '@/components/shared';
import {
  useIncidents,
  useCreateIncident,
  useUpdateIncidentStatus,
  useResolveIncident,
  useAssociateEvidence,
} from '../hooks';
import type { Incident, IncidentSeverity, IncidentStatus, IncidentType } from '../types';
import {
  IncidentSeverityBadge,
  ResolveIncidentDialog,
  AssociateEvidenceDialog,
  CreateIncidentDialog,
} from '../components';

const columnHelper = createColumnHelper<Incident>();

const typeLabels: Record<IncidentType, string> = {
  ACCIDENT: 'Accidente',
  BREAKDOWN: 'Avería Mecánica',
  ROAD_BLOCK: 'Bloqueo de Vía',
  DELIVERY_ISSUE: 'Problema de Entrega',
  OTHER: 'Otro',
};

const statusLabels: Record<IncidentStatus, string> = {
  REPORTED: 'Reportado',
  IN_REVIEW: 'En revisión',
  RESOLVED: 'Resuelto',
};

const statusClasses: Record<IncidentStatus, string> = {
  REPORTED: 'bg-slate-100 text-slate-700 border border-slate-200',
  IN_REVIEW: 'bg-blue-50 text-[#3B82F6] border border-blue-200',
  RESOLVED: 'bg-[#DFF6F1] text-[#0F766E] border border-teal-200',
};

export function IncidentsPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | IncidentSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | IncidentStatus>('all');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const { toast } = useToast();
  const incidentsQuery = useIncidents();

  const createIncidentMutation = useCreateIncident();
  const updateStatusMutation = useUpdateIncidentStatus();
  const resolveIncidentMutation = useResolveIncident();
  const associateEvidenceMutation = useAssociateEvidence();

  const incidents = useMemo(() => incidentsQuery.data ?? [], [incidentsQuery.data]);

  // Filtrar incidentes
  const filteredIncidents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return incidents.filter((inc) => {
      const matchesSearch =
        inc.id.toLowerCase().includes(term) ||
        inc.description.toLowerCase().includes(term) ||
        inc.location.toLowerCase().includes(term) ||
        inc.serviceReference.toLowerCase().includes(term);
      const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, search, severityFilter, statusFilter]);

  const activeSelectedIncident = useMemo(() => {
    if (!selectedIncident) return null;
    return incidents.find((i) => i.id === selectedIncident.id) || null;
  }, [incidents, selectedIncident]);

  // Contadores por severidad para incidentes ACTIVOS (sin resolver)
  const severityMetrics = useMemo(() => {
    const active = incidents.filter((i) => i.status !== 'RESOLVED');
    return {
      high: active.filter((i) => i.severity === 'HIGH').length,
      medium: active.filter((i) => i.severity === 'MEDIUM').length,
      low: active.filter((i) => i.severity === 'LOW').length,
      totalActive: active.length,
    };
  }, [incidents]);

  const handleCreateSubmit = (payload: any) => {
    createIncidentMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false);
        toast({ title: 'Incidencia reportada correctamente', type: 'success' });
      },
      onError: (err) => {
        toast({ title: err.message || 'Error al reportar incidencia', type: 'error' });
      },
    });
  };

  const handleStartReview = (id: string) => {
    updateStatusMutation.mutate(
      { id, status: 'IN_REVIEW', note: 'Se inició el análisis y revisión de la alerta.' },
      {
        onSuccess: (updated) => {
          setSelectedIncident(updated);
          toast({ title: 'Incidente puesto en revisión', type: 'success' });
        },
        onError: (err) => {
          toast({ title: err.message || 'Error al cambiar estado', type: 'error' });
        },
      }
    );
  };

  const handleResolveSubmit = (payload: any) => {
    if (!selectedIncident) return;
    resolveIncidentMutation.mutate(
      { id: selectedIncident.id, payload },
      {
        onSuccess: (updated) => {
          setSelectedIncident(updated);
          setIsResolveOpen(false);
          toast({ title: 'Incidencia resuelta exitosamente', type: 'success' });
        },
        onError: (err) => {
          toast({ title: err.message || 'Error al resolver incidencia', type: 'error' });
        },
      }
    );
  };

  const handleEvidenceSubmit = (evidenceId: string) => {
    if (!selectedIncident) return;
    associateEvidenceMutation.mutate(
      { id: selectedIncident.id, evidenceId },
      {
        onSuccess: (updated) => {
          setSelectedIncident(updated);
          setIsEvidenceOpen(false);
          toast({ title: 'Evidencia asociada correctamente', type: 'success' });
        },
        onError: (err) => {
          toast({ title: err.message || 'Error al asociar evidencia', type: 'error' });
        },
      }
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID / Alerta',
        cell: (info) => <span className="font-semibold text-slate-900">#{info.getValue()}</span>,
      }),
      columnHelper.accessor('type', {
        header: 'Tipo',
        cell: (info) => <span className="text-slate-800 font-medium">{typeLabels[info.getValue()]}</span>,
      }),
      columnHelper.accessor('serviceReference', {
        header: 'Orden Ref.',
        cell: (info) => <span className="text-slate-600 font-medium">Orden #{info.getValue()}</span>,
      }),
      columnHelper.accessor('severity', {
        header: 'Severidad',
        cell: (info) => <IncidentSeverityBadge severity={info.getValue()} />,
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue();
          return <Badge className={statusClasses[status]}>{statusLabels[status]}</Badge>;
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Reportado',
        cell: (info) => (
          <span className="text-[#64748B] text-xs">
            {new Date(info.getValue()).toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit' })}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-500"
              onClick={() => setSelectedIncident(row.original)}
              aria-label="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredIncidents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Centro de Incidentes</h1>
        <p className="mt-2 text-sm text-[#64748B]">Monitoreo de contingencias, bloqueos y fallas operacionales.</p>
      </div>

      {/* Panel de Alertas Activas */}
      <div className="grid gap-5 md:grid-cols-4">
        <Card className="p-5 flex items-center justify-between bg-red-950 text-white border-none shadow-md">
          <div>
            <p className="text-xs uppercase tracking-wider text-red-200 font-semibold">Severidad Alta</p>
            <p className="mt-3 text-4xl font-black">{severityMetrics.high}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-900 text-red-100">
            <AlertTriangle className="h-6 w-6 animate-bounce" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between bg-amber-500 text-slate-950 border-none shadow-md">
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-900 font-semibold">Severidad Media</p>
            <p className="mt-3 text-4xl font-black">{severityMetrics.medium}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-slate-950">
            <Clock className="h-6 w-6" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between bg-slate-900 text-white border-none shadow-md">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Severidad Baja</p>
            <p className="mt-3 text-4xl font-black">{severityMetrics.low}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-100">
            <Layers className="h-6 w-6" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between border-dashed border-slate-300">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#64748B] font-semibold">Alertas Abiertas</p>
            <p className="mt-3 text-4xl font-black text-slate-900">{severityMetrics.totalActive}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <FileBadge className="h-6 w-6" />
          </div>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por ID, descripción u orden..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value as any)}
            className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          >
            <option value="all">Todas las severidades</option>
            <option value="LOW">Baja (LOW)</option>
            <option value="MEDIUM">Media (MEDIUM)</option>
            <option value="HIGH">Alta (HIGH)</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as any)}
            className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="REPORTED">Reportado</option>
            <option value="IN_REVIEW">En revisión</option>
            <option value="RESOLVED">Resuelto</option>
          </select>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Reportar Incidente
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className={`overflow-hidden lg:col-span-2 ${activeSelectedIncident ? '' : 'lg:col-span-3'}`}>
          {incidentsQuery.isLoading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : incidentsQuery.isError ? (
            <div className="p-5">
              <ApiErrorState onRetry={() => void incidentsQuery.refetch()} />
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#64748B] font-medium">
              No hay alertas activas. La operación está en estado normal.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="border-b border-[#E2E8F0] px-6 py-4">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b border-[#E2E8F0] last:border-b-0 hover:bg-slate-50 transition-colors ${
                        row.original.severity === 'HIGH' && row.original.status !== 'RESOLVED'
                          ? 'bg-red-50/30'
                          : ''
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {activeSelectedIncident && (
          <Card className="p-5 flex flex-col justify-between h-fit space-y-6">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Incidencia #{activeSelectedIncident.id}</h2>
                <span className="text-xs text-[#64748B] font-medium">Tipo: {typeLabels[activeSelectedIncident.type]}</span>
              </div>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedIncident(null)}
                aria-label="Cerrar detalle"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#64748B] font-semibold block uppercase">Descripción</span>
                <p className="text-sm text-slate-800 mt-1 font-medium bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  {activeSelectedIncident.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#64748B] font-semibold block uppercase">Orden Relacionada</span>
                  <span className="text-slate-800 font-semibold text-sm">Orden #{activeSelectedIncident.serviceReference}</span>
                </div>
                <div>
                  <span className="text-[#64748B] font-semibold block uppercase">Ubicación</span>
                  <div className="flex items-center gap-1 mt-1 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{activeSelectedIncident.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#64748B] font-semibold block uppercase">Conductor Reportero</span>
                  <div className="flex items-center gap-1 mt-1 text-slate-700">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>{activeSelectedIncident.reporterReference}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#64748B] font-semibold block uppercase">Severidad / Estado</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <IncidentSeverityBadge severity={activeSelectedIncident.severity} />
                    <Badge className={statusClasses[activeSelectedIncident.status]}>
                      {statusLabels[activeSelectedIncident.status]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Evidencias Vinculadas */}
              <div className="border-t border-[#E2E8F0] pt-4">
                <span className="text-[#64748B] font-semibold block uppercase mb-2">Evidencias Adjuntas</span>
                {activeSelectedIncident.evidenceReferences.length === 0 ? (
                  <p className="text-slate-400 italic">No hay evidencias vinculadas.</p>
                ) : (
                  <div className="space-y-1.5">
                    {activeSelectedIncident.evidenceReferences.map((evRef) => (
                      <div key={evRef} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 border border-slate-100 rounded-lg">
                        <FileText className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span className="font-semibold text-slate-850">Referencia: {evRef}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resolución */}
              {activeSelectedIncident.resolution && (
                <div className="border-t border-teal-200 bg-emerald-50/20 p-3 rounded-lg border">
                  <span className="text-[#0F766E] font-bold block uppercase mb-1">Resolución del Incidente</span>
                  <div className="space-y-1 text-slate-750">
                    <p><strong>Tipo:</strong> {activeSelectedIncident.resolution.type}</p>
                    <p><strong>Acción:</strong> {activeSelectedIncident.resolution.summary}</p>
                    <p><strong>Responsable:</strong> {activeSelectedIncident.resolution.responsible}</p>
                    <p><strong>Cerrado:</strong> {new Date(activeSelectedIncident.resolution.closedAt).toLocaleString('es-PE')}</p>
                  </div>
                </div>
              )}

              {/* Historial de Estados */}
              <div className="border-t border-[#E2E8F0] pt-4">
                <span className="text-[#64748B] font-semibold block uppercase mb-2">Historial de Estados</span>
                <div className="relative border-l border-slate-200 pl-4 ml-1 space-y-3">
                  {activeSelectedIncident.statusHistory.map((log, index) => (
                    <div key={index} className="relative">
                      <span className="absolute -left-[20px] top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white border border-[#E2E8F0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                      </span>
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                          <span className="font-bold text-slate-700">{statusLabels[log.status]}</span>
                          <span>{new Date(log.changedAt).toLocaleString('es-PE')}</span>
                        </div>
                        {log.note && <p className="text-[#64748B] mt-0.5">{log.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col gap-2">
              {activeSelectedIncident.status === 'REPORTED' && (
                <Button
                  className="w-full h-10 text-xs"
                  onClick={() => handleStartReview(activeSelectedIncident.id)}
                  disabled={updateStatusMutation.isPending}
                >
                  Poner en Revisión
                </Button>
              )}
              {activeSelectedIncident.status === 'IN_REVIEW' && (
                <Button className="w-full h-10 text-xs" onClick={() => setIsResolveOpen(true)}>
                  Resolver Incidencia
                </Button>
              )}
              {activeSelectedIncident.status !== 'RESOLVED' && (
                <Button variant="secondary" className="w-full h-10 text-xs" onClick={() => setIsEvidenceOpen(true)}>
                  Asociar Evidencia
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      <CreateIncidentDialog
        open={isCreateOpen}
        isSubmitting={createIncidentMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {activeSelectedIncident && (
        <ResolveIncidentDialog
          open={isResolveOpen}
          incidentId={activeSelectedIncident.id}
          isSubmitting={resolveIncidentMutation.isPending}
          onClose={() => setIsResolveOpen(false)}
          onSubmit={handleResolveSubmit}
        />
      )}

      {activeSelectedIncident && (
        <AssociateEvidenceDialog
          open={isEvidenceOpen}
          incidentId={activeSelectedIncident.id}
          isSubmitting={associateEvidenceMutation.isPending}
          onClose={() => setIsEvidenceOpen(false)}
          onSubmit={handleEvidenceSubmit}
        />
      )}
    </section>
  );
}
