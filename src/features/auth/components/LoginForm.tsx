import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { Input, Button } from '@/components/ui';
import { loginSchema } from '../validations/loginSchema';
import { authService } from '../services/authService';
import { login } from '../store';
import { isAxiosError } from 'axios';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Datos invalidos');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.signIn(email, password);
      if (res.status === 200) {
        const data = res.data;
        dispatch(login({
          user: {
            id: String(data.id),
            email: data.email,
            name: data.email.split('@')[0],
            roles: data.roles,
          },
          token: data.token,
        }));
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas');
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
      <label className="space-y-1 text-sm font-medium text-slate-700 block">
        Correo electronico
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="supervisor@cobox.com"
          required
        />
      </label>
      <label className="space-y-1 text-sm font-medium text-slate-700 block">
        Contrasena
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>
      {error ? <p className="text-sm font-medium text-[#EF4444]">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>
      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <Link to="/auth/register" className="font-medium text-[#0F766E] hover:underline">Registrate</Link>
      </p>
    </form>
  );
}
