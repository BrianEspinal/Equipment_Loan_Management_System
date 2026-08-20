import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Laptop,
  ArrowLeftRight,
  Users,
  Layers,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Panel Principal', icon: LayoutDashboard },
    { to: '/loans', label: 'Préstamos', icon: ArrowLeftRight },
    { to: '/equipment', label: 'Equipos e Inventario', icon: Laptop },
    { to: '/employees', label: 'Empleados', icon: Users },
    { to: '/catalogs', label: 'Catálogos', icon: Layers },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white font-black shadow-md shadow-sky-500/30">
              EL
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">ELMS</span>
              <span className="block text-[10px] text-sky-400 font-medium -mt-1 tracking-wider uppercase">
                Control de Préstamos
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menú de Gestión
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-900/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 m-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
          <p className="font-semibold text-slate-200">Sistema ELMS</p>
          <p className="text-[11px] text-slate-400 mt-0.5">ASP.NET Core 10 & React</p>
        </div>
      </aside>
    </>
  );
};
