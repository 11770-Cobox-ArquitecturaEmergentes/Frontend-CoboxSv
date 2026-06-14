import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-lg">
              CB
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
