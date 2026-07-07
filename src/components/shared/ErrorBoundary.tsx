import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary capturó un error de render:', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-lg rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#EF4444]">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-950">Ocurrió un error inesperado.</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                La interfaz no pudo renderizar esta vista. Revisa la consola del navegador para más detalles.
              </p>
            </div>
          </div>
          <pre className="mt-4 max-h-48 overflow-auto rounded-md border border-[#E2E8F0] bg-slate-50 p-3 text-xs text-slate-700">
            {error.message ?? String(error)}
          </pre>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={this.handleReset}>
              <RefreshCw className="h-4 w-4" /> Reintentar
            </Button>
            <Button onClick={() => window.location.reload()}>Recargar página</Button>
          </div>
        </div>
      </div>
    );
  }
}