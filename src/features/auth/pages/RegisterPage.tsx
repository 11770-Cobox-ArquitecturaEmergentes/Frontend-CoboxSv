import { RegisterForm } from '../components';

export function RegisterPage() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-950">Crear cuenta</h1>
        <p className="mt-2 text-sm text-slate-500">Registrate para acceder al sistema.</p>
      </div>
      <RegisterForm />
    </section>
  );
}
