import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Wrench,
  Search,
  Plus,
  Eye,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
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
  useMaintenanceOrders,
  useCreateMaintenanceOrder,
  useScheduleMaintenanceOrder,
  useStartMaintenanceOrder,
  useCompleteMaintenanceOrder,
  useCancelMaintenanceOrder,
} from "../hooks";
import type {
  MaintenanceOrder,
  MaintenanceOrderStatus,
  MaintenanceType,
  MaintenancePriority,
} from "../types";

const columnHelper = createColumnHelper<MaintenanceOrder>();

const typeLabels: Record<MaintenanceType, string> = {
  PREVENTIVE: "Preventivo",
  CORRECTIVE: "Correctivo",
  PREDICTIVE: "Predictivo",
};

const priorityLabels: Record<MaintenancePriority, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  CRITICAL: "Crítica",
};

const statusLabels: Record<MaintenanceOrderStatus, string> = {
  OPEN: "Abierto",
  SCHEDULED: "Programado",
  IN_PROGRESS: "En Progreso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const statusClasses: Record<MaintenanceOrderStatus, string> = {
  OPEN: "bg-slate-100 text-slate-700 border border-slate-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border border-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border border-amber-200",
  COMPLETED: "bg-green-50 text-green-700 border border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border border-red-200",
};

const priorityClasses: Record<MaintenancePriority, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export function MaintenancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | MaintenanceOrderStatus
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | MaintenanceType>("all");
  const [selectedOrder, setSelectedOrder] = useState<MaintenanceOrder | null>(
    null,
  );

  const { toast } = useToast();
  const ordersQuery = useMaintenanceOrders();

  const scheduleOrderMutation = useScheduleMaintenanceOrder();
  const startOrderMutation = useStartMaintenanceOrder();
  const completeOrderMutation = useCompleteMaintenanceOrder();
  const cancelOrderMutation = useCancelMaintenanceOrder();

  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toString().includes(term) ||
        order.vehicleId.toString().includes(term) ||
        order.type?.toLowerCase().includes(term) ||
        order.reason?.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesType =
        typeFilter === "all" || order.maintenanceType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, search, statusFilter, typeFilter]);

  const activeSelectedOrder = useMemo(() => {
    if (!selectedOrder) return null;
    return orders.find((o) => o.id === selectedOrder.id) || null;
  }, [orders, selectedOrder]);

  // Métricas
  const metrics = useMemo(() => {
    const active = orders.filter(
      (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED",
    );
    return {
      total: orders.length,
      active: active.length,
      openOrders: active.filter((o) => o.status === "OPEN").length,
      inProgress: active.filter((o) => o.status === "IN_PROGRESS").length,
      completed: orders.filter((o) => o.status === "COMPLETED").length,
    };
  }, [orders]);

  // Acciones
  const handleSchedule = (orderId: number) => {
    scheduleOrderMutation.mutate(
      { orderId, payload: { scheduledTimelapseDays: 7 } },
      {
        onSuccess: (updated) => {
          setSelectedOrder(updated);
          toast({ title: "Orden programada correctamente", type: "success" });
        },
        onError: (err: any) => {
          toast({
            title: err.message || "Error al programar orden",
            type: "error",
          });
        },
      },
    );
  };

  const handleStart = (orderId: number) => {
    startOrderMutation.mutate(orderId, {
      onSuccess: (updated) => {
        setSelectedOrder(updated);
        toast({ title: "Mantenimiento iniciado", type: "success" });
      },
      onError: (err: any) => {
        toast({
          title: err.message || "Error al iniciar mantenimiento",
          type: "error",
        });
      },
    });
  };

  const handleComplete = (orderId: number, closingOdometer: number) => {
    completeOrderMutation.mutate(
      { orderId, payload: { closingOdometer } },
      {
        onSuccess: (updated) => {
          setSelectedOrder(updated);
          toast({ title: "Mantenimiento completado", type: "success" });
        },
        onError: (err: any) => {
          toast({
            title: err.message || "Error al completar mantenimiento",
            type: "error",
          });
        },
      },
    );
  };

  const handleCancel = (orderId: number, reason: string) => {
    cancelOrderMutation.mutate(
      { orderId, payload: { reason } },
      {
        onSuccess: (updated) => {
          setSelectedOrder(updated);
          toast({ title: "Orden cancelada", type: "success" });
        },
        onError: (err: any) => {
          toast({
            title: err.message || "Error al cancelar orden",
            type: "error",
          });
        },
      },
    );
  };

  // Tabla
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="font-mono text-sm font-semibold">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("vehicleId", {
      header: "Vehículo",
      cell: (info) => (
        <span className="text-sm">Vehículo #{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("maintenanceType", {
      header: "Tipo",
      cell: (info) => (
        <span className="text-sm">{typeLabels[info.getValue()]}</span>
      ),
    }),
    columnHelper.accessor("priority", {
      header: "Prioridad",
      cell: (info) => (
        <Badge className={priorityClasses[info.getValue()]}>
          {priorityLabels[info.getValue()]}
        </Badge>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Estado",
      cell: (info) => (
        <Badge className={statusClasses[info.getValue()]}>
          {statusLabels[info.getValue()]}
        </Badge>
      ),
    }),
    columnHelper.accessor("openingOdometer", {
      header: "Odómetro Inicial",
      cell: (info) => <span className="text-sm">{info.getValue()} km</span>,
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <button
          onClick={() => setSelectedOrder(info.row.original)}
          className="text-blue-600 hover:text-blue-900 p-1"
          title="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (ordersQuery.isError) {
    return (
      <ApiErrorState
        title="Error al cargar órdenes de mantenimiento"
        message="No pudimos cargar las órdenes"
        onRetry={() => ordersQuery.refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Gestión de Mantenimiento"
        description="Monitorea y gestiona órdenes de mantenimiento"
      />

      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <p className="text-xs text-gray-600 font-medium">Total Órdenes</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-slate-500">
            <p className="text-xs text-gray-600 font-medium">Activas</p>
            <p className="text-2xl font-bold text-slate-700">
              {metrics.active}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500">
            <p className="text-xs text-gray-600 font-medium">Abiertas</p>
            <p className="text-2xl font-bold text-blue-700">
              {metrics.openOrders}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-amber-500">
            <p className="text-xs text-gray-600 font-medium">En Progreso</p>
            <p className="text-2xl font-bold text-amber-700">
              {metrics.inProgress}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <p className="text-xs text-gray-600 font-medium">Completadas</p>
            <p className="text-2xl font-bold text-green-700">
              {metrics.completed}
            </p>
          </Card>
        </div>

        {/* Filtros */}
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
                  placeholder="Buscar por ID, vehículo o tipo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label
                htmlFor="type-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tipo
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="PREVENTIVE">Preventivo</option>
                <option value="CORRECTIVE">Correctivo</option>
                <option value="PREDICTIVE">Predictivo</option>
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
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="OPEN">Abierto</option>
                <option value="SCHEDULED">Programado</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
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
                {ordersQuery.isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-8 text-center"
                    >
                      <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        No hay órdenes para mostrar
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

      {/* Panel lateral de detalles */}
      {activeSelectedOrder && (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-40 overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-lg">Detalles de Orden</h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-500 font-medium">ID de Orden</p>
              <p className="text-sm font-mono text-gray-900 mt-1">
                {activeSelectedOrder.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium">Vehículo</p>
                <p className="text-sm text-gray-900 mt-1">
                  #{activeSelectedOrder.vehicleId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Tipo</p>
                <p className="text-sm text-gray-900 mt-1">
                  {typeLabels[activeSelectedOrder.maintenanceType]}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium">Prioridad</p>
                <div className="mt-2">
                  <Badge
                    className={priorityClasses[activeSelectedOrder.priority]}
                  >
                    {priorityLabels[activeSelectedOrder.priority]}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Estado</p>
                <div className="mt-2">
                  <Badge className={statusClasses[activeSelectedOrder.status]}>
                    {statusLabels[activeSelectedOrder.status]}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">Razón</p>
              <p className="text-sm text-gray-900 mt-1">
                {activeSelectedOrder.reason}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Odómetro Inicial
                </p>
                <p className="text-sm text-gray-900 mt-1">
                  {activeSelectedOrder.openingOdometer} km
                </p>
              </div>
              {activeSelectedOrder.closingOdometer && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Odómetro Final
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {activeSelectedOrder.closingOdometer} km
                  </p>
                </div>
              )}
            </div>

            {activeSelectedOrder.jobs &&
              activeSelectedOrder.jobs.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Trabajos ({activeSelectedOrder.jobs.length})
                  </p>
                  <div className="mt-2 space-y-2">
                    {activeSelectedOrder.jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 ${job.completed ? "text-green-600" : "text-gray-300"}`}
                        />
                        <span
                          className={
                            job.completed
                              ? "text-gray-600 line-through"
                              : "text-gray-900"
                          }
                        >
                          {job.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {activeSelectedOrder.totalCostAmount && (
              <div>
                <p className="text-xs text-gray-500 font-medium">Costo Total</p>
                <p className="text-sm text-gray-900 mt-1">
                  {activeSelectedOrder.totalCostAmount}{" "}
                  {activeSelectedOrder.totalCostCurrency}
                </p>
              </div>
            )}

            <div className="pt-4 border-t space-y-2">
              {activeSelectedOrder.status === "OPEN" && (
                <>
                  <Button
                    onClick={() => handleSchedule(activeSelectedOrder.id)}
                    disabled={scheduleOrderMutation.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Programar
                  </Button>
                  <Button
                    onClick={() =>
                      handleCancel(
                        activeSelectedOrder.id,
                        "Cancelado por usuario",
                      )
                    }
                    disabled={cancelOrderMutation.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    Cancelar Orden
                  </Button>
                </>
              )}

              {activeSelectedOrder.status === "SCHEDULED" && (
                <Button
                  onClick={() => handleStart(activeSelectedOrder.id)}
                  disabled={startOrderMutation.isPending}
                  className="w-full"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Iniciar Mantenimiento
                </Button>
              )}

              {activeSelectedOrder.status === "IN_PROGRESS" && (
                <Button
                  onClick={() =>
                    handleComplete(
                      activeSelectedOrder.id,
                      activeSelectedOrder.openingOdometer + 100,
                    )
                  }
                  disabled={completeOrderMutation.isPending}
                  className="w-full"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
