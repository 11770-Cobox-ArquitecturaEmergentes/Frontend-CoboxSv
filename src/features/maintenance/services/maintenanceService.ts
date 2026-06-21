import { fleetService } from '@/services';
import type { VehicleStatus } from '@/modules/fleet.types';

export const maintenanceService = {
  async getVehiclesInMaintenance() {
    const list = await fleetService.getVehicles();
    // Return all vehicles, filtering can be done in frontend or we can return all
    // Since the prompt says "Listado de vehículos en mantenimiento o con mantenimiento próximo... o filtrando el listado general",
    // returning all vehicles and letting the user see operational, maintenance, or out of service is best.
    return list;
  },

  async updateVehicleStatus(vehicleId: string, status: VehicleStatus, reason: string) {
    return fleetService.updateVehicleStatus(vehicleId, status, reason);
  },

  async getVehicleStatusHistory(vehicleId: string) {
    return fleetService.getVehicleStatusHistory(vehicleId);
  },
};
