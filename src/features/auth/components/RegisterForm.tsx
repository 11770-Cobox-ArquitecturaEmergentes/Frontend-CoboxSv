import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Select } from '@/components/ui';
import { authService } from '../services/authService';
import { isAxiosError } from 'axios';

type RoleOption = 'ROLE_MANAGER' | 'ROLE_DRIVER';

const roleLabels: Record<RoleOption, string> = {
  ROLE_MANAGER: 'Supervisor',
  ROLE_DRIVER: 'Conductor',
};

export function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '', role: 'ROLE_MANAGER' as RoleOption });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      setError('Todos los campos obligatorios deben estar llenos');
      return;
    }
    if (form.password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.signUp({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        roles: [form.role],
      });

      if (res.status === 201) {
        navigate('/auth/login');
      } else {
        setError('No se pudo crear la cuenta. Verifica los datos.');
      }
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Error del servidor'
        : 'Error de conexion';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-sm font-medium text-slate-700 block">
          Nombres
          <Input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Juan" required />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700 block">
          Apellidos
          <Input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Perez" required />
        </label>
      </div>
      <label className="space-y-1 text-sm font-medium text-slate-700 block">
        Correo electronico
        <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="correo@cobox.com" required />
      </label>
      <label className="space-y-1 text-sm font-medium text-slate-700 block">
        Telefono
        <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="999999999" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-sm font-medium text-slate-700 block">
          Contrasena
          <Input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min. 8 caracteres" required />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700 block">
          Confirmar
          <Input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repetir contrasena" required />
        </label>
      </div>
      <label className="space-y-1 text-sm font-medium text-slate-700 block">
        Rol
        <Select value={form.role} onChange={(e) => update('role', e.target.value)}>
          {Object.entries(roleLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </label>
      {error ? <p className="text-sm font-medium text-[#EF4444]">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/auth/login" className="font-medium text-[#0F766E] hover:underline">Inicia sesion</Link>
      </p>
    </form>
  );
}
