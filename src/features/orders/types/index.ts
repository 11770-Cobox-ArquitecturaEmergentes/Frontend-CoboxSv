export type OrderStatus = 'RECEIVED' | 'PROCESSING' | 'READY_FOR_DISPATCH' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export type BackendOrderResource = {
  id: number;
  clientId: number;
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  referenceLatitude: number;
  referenceLongitude: number;
  notes: string;
  weightKg: number;
  orderStatus: OrderStatus;
};

export type Order = {
  id: string;
  clientId: number;
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  referenceLatitude: number;
  referenceLongitude: number;
  notes: string;
  weightKg: number;
  status: OrderStatus;
  // Cruzados desde rutas/flotas
  assignedRouteId?: string;
  driverName?: string;
  vehiclePlate?: string;
};

export type CreateOrderPayload = {
  clientId: number;
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  referenceLatitude: number;
  referenceLongitude: number;
  notes: string;
  weightKg: number;
};

export type MarkAsCompletedPayload = {
  routeId: number;
  photoUrl: string;
  receiverName: string;
  signatureData: string;
};
