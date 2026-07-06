import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Topbar } from './Topbar';

type Auth0UserWithRoles = {
  'https://cobox/roles'?: string[];
};

export function DriverLayout() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Cargando...</p>
      </div>
    );
  }

  const roles = (user as Auth0UserWithRoles | undefined)?.['https://cobox/roles'] ?? [];

  if (!isAuthenticated || !roles.includes('ROLE_DRIVER')) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}