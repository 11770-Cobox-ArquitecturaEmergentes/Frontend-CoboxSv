import { LoginForm } from '../components';

export function LoginPage() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-950">CoBox SmartVision</h1>
        <p className="mt-2 text-sm text-slate-500">Acceso empresarial para supervisores y conductores.</p>
      </div>
      <LoginForm />
    </section>
  );
}
