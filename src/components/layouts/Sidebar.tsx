import { NavLink } from 'react-router-dom';
import { LogOut, Truck } from 'lucide-react';
import { sidebarItems } from '@/config/navigation';
import { cn } from '@/utils';

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-[#E2E8F0] bg-white text-slate-950">
      <div className="flex h-20 items-center justify-between border-b border-[#E2E8F0] px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-white">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-5">CoBox</p>
            <p className="text-xs text-[#0F766E]">SmartVision</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-3">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-[#0F766E] text-white'
                      : 'text-slate-950 hover:bg-[#DFF6F1] hover:text-[#0F766E]',
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        className="flex items-center gap-3 border-t border-[#E2E8F0] px-6 py-5 text-sm font-semibold text-slate-950 hover:text-[#0F766E]"
      >
        <LogOut className="h-5 w-5" />
        Cerrar sesion
      </button>
    </aside>
  );
}
