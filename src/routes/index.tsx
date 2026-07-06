import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthLayout, DashboardLayout, DriverLayout } from '@/components/layouts';
import { LoginPage, RegisterPage } from '@/features/auth';
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
import { SupportPage, TicketDetailPage } from '@/modules/support';

function RootRedirect() {
  const { isLoading, isAuthenticated } = useAuth0();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Cargando...</p>
      </div>
    );
  }
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/auth/login" replace />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
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
        <Route path="/support" element={<SupportPage />} />
        <Route path="/support/:id" element={<TicketDetailPage />} />
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
