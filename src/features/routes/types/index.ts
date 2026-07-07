export type RouteStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

export type BackendOrderIdResource = {
  orderId: number;
};

export type BackendRouteResource = {
  id: number;
  title: string | null;
  vehicleId: number | null;
  driverId: number | null;
  ordersIds: BackendOrderIdResource[];
  finishedOrderIds: BackendOrderIdResource[];
  routeStatus: RouteStatus;
};

export type Route = {
  id: string;
  title: string;
  vehicleId: string | null;
  driverId: string | null;
  orderIds: string[];
  finishedOrderIds: string[];
  status: RouteStatus;
};

export type CreateRoutePayload = {
  title: string;
};

export type RouteOrderPayload = {
  orderId: string;
};

export type AssignDriverPayload = {
  driverId: string;
};

export type AssignVehiclePayload = {
  vehicleId: string;
};
