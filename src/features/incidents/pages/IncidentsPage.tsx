import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertTriangle,
  Clock,
  Eye,
  Plus,
  Search,
  X,
  User,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Skeleton,
  useToast,
} from "@/components/ui";
import { ApiErrorState } from "@/components/shared";
import { PageHeader } from "@/components/common";
import {
  useIncidents,
  useIncidentBySourceAlert,
  useCreateIncident,
  useUpdateIncidentStatus,
  useAssignResponsible,
} from "../hooks";
import type {
  AssignResponsiblePayload,
  CreateIncidentPayload,
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from "../types";
import {
  IncidentSeverityBadge,
  UpdateIncidentStatusDialog,
  AssignResponsibleDialog,
  CreateIncidentDialog,
} from "../components";

const columnHelper = createColumnHelper<Incident>();

const statusLabels: Record<IncidentStatus, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En Progreso",
  ESCALATED: "Escalado",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

const statusClasses: Record<IncidentStatus, string> = {
  OPEN: "bg-slate-100 text-slate-700 border border-slate-200",
  IN_PROGRESS: "bg-blue-50 text-[#3B82F6] border border-blue-200",
  ESCALATED: "bg-orange-50 text-orange-700 border border-orange-200",
  RESOLVED: "bg-[#DFF6F1] text-[#0F766E] border border-teal-200",
  CLOSED: "bg-gray-50 text-gray-700 border border-gray-200",
};

export function IncidentsPage() {
  const [searchParams] = useSearchParams();
  const sourceAlertId = searchParams.get("sourceAlertId");
  const navigate = useNavigate();
  const sourceIncidentQuery = useIncidentBySourceAlert(
    sourceAlertId ?? undefined,
  );

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<
    "all" | IncidentSeverity
  >("all");
  const [statusFilter, setStatusFilter] = useState<"all" | IncidentStatus>(
    "all",
  );

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );

  const { toast } = useToast();
  const incidentsQuery = useIncidents();

  const createIncidentMutation = useCreateIncident();
  const updateStatusMutation = useUpdateIncidentStatus();
  const assignMutation = useAssignResponsible();

  const incidents = useMemo(
    () => incidentsQuery.data ?? [],
    [incidentsQuery.data],
  );

  // Filtrar incidentes
  const filteredIncidents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return incidents.filter((inc) => {
      const matchesSearch =
        inc.incidentId.toLowerCase().includes(term) ||
        inc.type.toLowerCase().includes(term) ||
        inc.description.toLowerCase().includes(term);
      const matchesSeverity =
        severityFilter === "all" || inc.severity === severityFilter;
      const matchesStatus =
        statusFilter === "all" || inc.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, search, severityFilter, statusFilter]);

  const activeSelectedIncident = useMemo(() => {
    if (!selectedIncident) return null;
    return (
      incidents.find((i) => i.incidentId === selectedIncident.incidentId) ||
      null
    );
  }, [incidents, selectedIncident]);

  useEffect(() => {
    if (selectedIncident) return;
    const source = sourceIncidentQuery.data;
    if (!source || !source.incidentId) return;
    const match = incidents.find((i) => i.incidentId === source.incidentId);
    if (match) setSelectedIncident(match);
  }, [sourceIncidentQuery.data, incidents, selectedIncident]);

  // Contadores por severidad
  const severityMetrics = useMemo(() => {
    const active = incidents.filter(
      (i) => i.status !== "CLOSED" && i.status !== "RESOLVED",
    );
    return {
      critical: active.filter((i) => i.severity === "CRITICAL").length,
      high: active.filter((i) => i.severity === "HIGH").length,
      medium: active.filter((i) => i.severity === "MEDIUM").length,
      low: active.filter((i) => i.severity === "LOW").length,
      totalActive: active.length,
    };
  }, [incidents]);

  const handleCreateSubmit = (payload: CreateIncidentPayload) => {
    createIncidentMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false);
        toast({ title: "Incidencia reportada correctamente", type: "success" });
      },
      onError: (err: unknown) => {
        toast({
          title: (err as { message?: string }).message || "Error al reportar incidencia",
          type: "error",
        });
      },
    });
  };

  const handleStatusSubmit = () => {
    if (!selectedIncident) return;
    updateStatusMutation.mutate(
      {
        incidentId: selectedIncident.incidentId,
        payload: { status: "IN_PROGRESS" },
      },
      {
        onSuccess: (updated) => {
          setSelectedIncident(updated);
          setIsStatusOpen(false);
          toast({ title: "Estado actualizado correctamente", type: "success" });
        },
        onError: (err: unknown) => {
          toast({
            title: (err as { message?: string }).message || "Error al cambiar estado",
            type: "error",
          });
        },
      },
    );
  };

  const handleAssignSubmit = (payload: AssignResponsiblePayload) => {
    if (!selectedIncident) return;
    assignMutation.mutate(
      { incidentId: selectedIncident.incidentId, payload },
      {
        onSuccess: (updated) => {
          setSelectedIncident(updated);
          setIsAssignOpen(false);
          toast({
            title: "Responsable asignado correctamente",
            type: "success",
          });
        },
        onError: (err: unknown) => {
          toast({
            title: (err as { message?: string }).message || "Error al asignar responsable",
            type: "error",
          });
        },
      },
    );
  };

  // Tabla
  const columns = [
    columnHelper.accessor("incidentId", {
      header: "ID",
      cell: (info) => (
        <span className="font-mono text-xs">
          {info.getValue().slice(0, 8)}...
        </span>
      ),
    }),
    columnHelper.accessor("type", {
      header: "Tipo",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("severity", {
      header: "Severidad",
      cell: (info) => <IncidentSeverityBadge severity={info.getValue()} />,
    }),
    columnHelper.accessor("status", {
      header: "Estado",
      cell: (info) => (
        <Badge className={statusClasses[info.getValue()]}>
          {statusLabels[info.getValue()]}
        </Badge>
      ),
    }),
    columnHelper.accessor("responsibleUserId", {
      header: "Responsable",
      cell: (info) => (
        <span className="text-sm text-gray-600">
          {info.getValue() ? `Usuario #${info.getValue()}` : "-"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <button
          onClick={() => setSelectedIncident(info.row.original)}
          className="text-blue-600 hover:text-blue-900 p-1"
          title="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredIncidents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (incidentsQuery.isError) {
    return (
      <ApiErrorState
        title="Error al cargar incidencias"
        message="No pudimos cargar la lista de incidencias"
        onRetry={() => incidentsQuery.refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Gestión de Incidencias"
        description="Monitorea y gestiona las incidencias operativas"
      />

      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <p className="text-xs text-gray-600 font-medium">Total Activo</p>
            <p className="text-2xl font-bold text-gray-900">
              {severityMetrics.totalActive}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-purple-500">
            <p className="text-xs text-gray-600 font-medium">Crítico</p>
            <p className="text-2xl font-bold text-purple-700">
              {severityMetrics.critical}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500">
            <p className="text-xs text-gray-600 font-medium">Alto</p>
            <p className="text-2xl font-bold text-red-700">
              {severityMetrics.high}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-amber-500">
            <p className="text-xs text-gray-600 font-medium">Medio</p>
            <p className="text-2xl font-bold text-amber-700">
              {severityMetrics.medium}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-slate-500">
            <p className="text-xs text-gray-600 font-medium">Bajo</p>
            <p className="text-2xl font-bold text-slate-700">
              {severityMetrics.low}
            </p>
          </Card>
        </div>

        {/* Filtros y acciones */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Buscar por tipo, descripción o ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label
                htmlFor="severity-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Severidad
              </label>
              <select
                id="severity-filter"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as "all" | IncidentSeverity)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>

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
                onChange={(e) => setStatusFilter(e.target.value as "all" | IncidentStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="OPEN">Abierto</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="ESCALATED">Escalado</option>
                <option value="RESOLVED">Resuelto</option>
                <option value="CLOSED">Cerrado</option>
              </select>
            </div>

            <Button
              onClick={() => setIsCreateOpen(true)}
              className="w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Reportar Incidencia
            </Button>
          </div>
        </Card>

        {/* Tabla */}
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
                {incidentsQuery.isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ) : filteredIncidents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-8 text-center"
                    >
                      <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        No hay incidencias para mostrar
                      </p>
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
      </div>

      {/* Detalle lateral */}
      {activeSelectedIncident && (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-40 overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-lg">Detalles de Incidencia</h3>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-500 font-medium">
                ID del Incidente
              </p>
              <p className="text-sm font-mono text-gray-900 mt-1">
                {activeSelectedIncident.incidentId}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">Tipo</p>
              <p className="text-sm text-gray-900 mt-1">
                {activeSelectedIncident.type}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">Severidad</p>
              <div className="mt-2">
                <IncidentSeverityBadge
                  severity={activeSelectedIncident.severity}
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">Estado</p>
              <div className="mt-2">
                <Badge className={statusClasses[activeSelectedIncident.status]}>
                  {statusLabels[activeSelectedIncident.status]}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">Descripción</p>
              <p className="text-sm text-gray-900 mt-1">
                {activeSelectedIncident.description}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">Reportado</p>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(activeSelectedIncident.reportedAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">
                Usuario Responsable
              </p>
              <p className="text-sm text-gray-900 mt-1">
                {activeSelectedIncident.responsibleUserId
                  ? `Usuario #${activeSelectedIncident.responsibleUserId}`
                  : "Sin asignar"}
              </p>
            </div>

            {activeSelectedIncident.sourceType ||
            activeSelectedIncident.sourceAlertId ||
            activeSelectedIncident.sourceClientEvidenceId ? (
              <div>
                <p className="text-xs text-gray-500 font-medium">Origen</p>
                <div className="mt-2 space-y-3">
                  {activeSelectedIncident.sourceType ? (
                    <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                      {activeSelectedIncident.sourceType === "AI_ALERT"
                        ? "Alerta IA"
                        : "Manual"}
                    </Badge>
                  ) : null}

                  {activeSelectedIncident.sourceAlertId ? (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Alerta origen</p>
                      <p className="text-sm font-mono text-gray-900">
                        {activeSelectedIncident.sourceAlertId.slice(0, 8)}...
                      </p>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() =>
                          navigate(
                            "/alerts?alertId=" +
                              activeSelectedIncident.sourceAlertId,
                          )
                        }
                      >
                        Ver alerta
                      </Button>
                    </div>
                  ) : null}

                  {activeSelectedIncident.sourceClientEvidenceId ? (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Evidencia</p>
                      <p className="text-sm font-mono text-gray-900">
                        {activeSelectedIncident.sourceClientEvidenceId.slice(
                          0,
                          8,
                        )}
                        ...
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="pt-4 border-t space-y-2">
              <Button
                onClick={() => setIsStatusOpen(true)}
                className="w-full"
                variant="secondary"
              >
                <Clock className="w-4 h-4 mr-2" />
                Cambiar Estado
              </Button>
              <Button
                onClick={() => setIsAssignOpen(true)}
                className="w-full"
                variant="secondary"
              >
                <User className="w-4 h-4 mr-2" />
                Asignar Responsable
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogos */}
      <CreateIncidentDialog
        open={isCreateOpen}
        isSubmitting={createIncidentMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {activeSelectedIncident && (
        <>
          <UpdateIncidentStatusDialog
            open={isStatusOpen}
            isSubmitting={updateStatusMutation.isPending}
            currentStatus={activeSelectedIncident.status}
            onClose={() => setIsStatusOpen(false)}
            onSubmit={handleStatusSubmit}
          />

          <AssignResponsibleDialog
            open={isAssignOpen}
            isSubmitting={assignMutation.isPending}
            currentResponsibleId={activeSelectedIncident.responsibleUserId}
            onClose={() => setIsAssignOpen(false)}
            onSubmit={handleAssignSubmit}
          />
        </>
      )}
    </div>
  );
}
