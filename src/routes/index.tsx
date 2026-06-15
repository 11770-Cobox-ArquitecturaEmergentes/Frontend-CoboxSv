import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout, DashboardLayout, DriverLayout } from '@/components/layouts';
import { LoginPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { SmartVisionPage } from '@/features/smartvision';
import { VehiclesPage } from '@/modules/vehicles';
import { DriversPage } from '@/modules/drivers';
import { OrdersPage } from '@/features/orders';
import { RoutesPage } from '@/modules/routes';
import { IncidentsPage } from '@/features/incidents';
import { MaintenancePage } from '@/features/maintenance';
import { ReportsPage } from '@/features/reports';
import { ProfilePage } from '@/features/profile';
import { SettingsPage } from '@/features/settings';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/smartvision" element={<SmartVisionPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/driver" element={<DriverLayout />}>
        <Route index element={<OrdersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
