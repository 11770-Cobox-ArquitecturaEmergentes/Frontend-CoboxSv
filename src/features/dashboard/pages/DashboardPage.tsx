import {
  FleetPerformanceChart,
  FuelConsumptionChart,
  VehicleHealthChart,
  RouteEfficiencyChart,
  FleetMap,
} from '@/components/dashboard';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <FleetPerformanceChart />
        <FuelConsumptionChart />
      </div>
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <VehicleHealthChart />
        <div className="lg:col-span-2">
          <RouteEfficiencyChart />
        </div>
      </div>
      <FleetMap />
    </div>
  );
}
