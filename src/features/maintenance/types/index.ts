export type MaintenanceEvent = {
  id: string;
  vehicleId: string;
  status: 'scheduled' | 'in_progress' | 'completed';
};
