import { Bell, Search, Settings, User } from 'lucide-react';

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-6">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
        <input
          type="search"
          placeholder="Buscar vehiculos, conductores, ordenes..."
          className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#DFF6F1]"
        />
      </div>
      <div className="ml-6 flex items-center gap-4">
        <button type="button" className="relative text-slate-950 hover:text-[#0F766E]" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#EF4444] ring-2 ring-white" />
        </button>
        <button type="button" className="text-slate-950 hover:text-[#0F766E]" aria-label="Configuracion">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-8 w-px bg-[#E2E8F0]" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold leading-5 text-slate-950">Admin Usuario</p>
            <p className="text-xs text-[#64748B]">Administrador</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E] text-white">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
