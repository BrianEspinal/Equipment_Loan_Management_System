import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const normalized = status?.toLowerCase() || '';

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;
  let dotColor = 'bg-slate-400';

  if (normalized === 'available' || normalized === 'disponible') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = 'Disponible';
    dotColor = 'bg-emerald-500';
  } else if (normalized === 'loaned' || normalized === 'prestado' || normalized === 'active' || normalized === 'activo') {
    styles = 'bg-sky-50 text-sky-700 border-sky-200';
    label = normalized.includes('loan') || normalized.includes('prest') ? 'Prestado' : 'Activo';
    dotColor = 'bg-sky-500';
  } else if (normalized === 'returned' || normalized === 'devuelto') {
    styles = 'bg-slate-100 text-slate-700 border-slate-200';
    label = 'Devuelto';
    dotColor = 'bg-slate-400';
  } else if (normalized === 'maintenance' || normalized === 'mantenimiento') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    label = 'Mantenimiento';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'overdue' || normalized === 'vencido') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    label = 'Vencido';
    dotColor = 'bg-rose-500';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};
