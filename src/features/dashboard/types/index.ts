export type DegradedSection = {
  section: string;
  reason: string;
};

export type RouteSummary = {
  id: number;
  title: string | null;
  vehicleId: number | null;
  driverId: number | null;
  orderIds: number[];
  finishedOrderIds: number[];
  status: string | null;
};

export type OrderSummary = {
  id: number;
  clientId: number | null;
  city: string | null;
  country: string | null;
  weightKg: number | null;
  status: string | null;
};

export type IncidentSummary = {
  id: number;
  incidentId: string;
  type: string | null;
  severity: string | null;
  status: string | null;
  reportedAt: string | null;
  responsibleUserId: number | null;
};

export type MaintenanceOrderSummary = {
  id: number;
  vehicleId: number | null;
  maintenanceType: string | null;
  priority: string | null;
  status: string | null;
  openingOdometer: number | null;
  closingOdometer: number | null;
  totalCostAmount: number | null;
  totalCostCurrency: string | null;
  technicianId: number | null;
};

export type FleetDashboard = {
  totalVehicles: number;
  totalDrivers: number;
  totalRoutes: number;
  vehiclesByStatus: Record<string, number>;
  driversByStatus: Record<string, number>;
  routesByStatus: Record<string, number>;
  activeRoutes: RouteSummary[];
};

export type DeliveriesDashboard = {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  recentOrders: OrderSummary[];
};

export type IncidentsDashboard = {
  totalIncidents: number;
  incidentsByStatus: Record<string, number>;
  incidentsBySeverity: Record<string, number>;
  openIncidents: IncidentSummary[];
};

export type MaintenanceDashboard = {
  totalOpenWork: number;
  ordersByStatus: Record<string, number>;
  openOrders: MaintenanceOrderSummary[];
};

export type OperationsDashboard = {
  generatedAt: string;
  fleet: FleetDashboard;
  deliveries: DeliveriesDashboard;
  incidents: IncidentsDashboard;
  maintenance: MaintenanceDashboard;
  degradedSections: DegradedSection[];
};
