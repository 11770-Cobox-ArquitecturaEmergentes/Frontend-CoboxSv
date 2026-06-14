import { NavLink } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { sidebarItems } from '@/config/navigation';
import { cn } from '@/utils';

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 text-white transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-slate-800 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold">
          CB
        </div>
        <span className="text-xl font-bold tracking-tight">CoBox SV</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
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
      <div className="border-t border-slate-800 p-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            )
          }
        >
          <Settings className="h-5 w-5" />
          Configuracion
        </NavLink>
      </div>
    </aside>
  );
}
