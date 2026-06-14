import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { login } from '../store';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSupervisorLogin = () => {
    dispatch(login({ id: 'supervisor-demo', name: 'Supervisor Demo', role: 'supervisor' }));
    navigate('/dashboard');
  };

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-950">CoBox SmartVision</h1>
        <p className="mt-2 text-sm text-slate-500">Acceso empresarial para supervisores y conductores.</p>
      </div>
      <button
        type="button"
        onClick={handleSupervisorLogin}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Ingresar como supervisor
      </button>
    </section>
  );
}
