import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/features/auth/store/authSlice';
import { useAppDispatch } from '@/hooks';

export function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">Panel de Control</h2>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="relative text-gray-500 hover:text-gray-700" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="mx-2 h-8 w-px bg-gray-300" />
        <div className="group flex cursor-pointer items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Supervisor</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="ml-2 text-gray-500 hover:text-red-600"
          title="Cerrar sesion"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
