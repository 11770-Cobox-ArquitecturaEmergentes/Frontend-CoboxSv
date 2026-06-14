import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Topbar } from './Topbar';

export function DriverLayout() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || user?.role !== 'driver') {
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
