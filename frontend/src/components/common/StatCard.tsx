import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  colorScheme?: 'sky' | 'emerald' | 'amber' | 'indigo' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = 'sky',
}) => {
  const schemes = {
    sky: {
      bgIcon: 'bg-sky-50 text-sky-600 border-sky-100',
      border: 'hover:border-sky-200',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      border: 'hover:border-emerald-200',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-100',
      border: 'hover:border-amber-200',
    },
    indigo: {
      bgIcon: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      border: 'hover:border-indigo-200',
    },
    rose: {
      bgIcon: 'bg-rose-50 text-rose-600 border-rose-100',
      border: 'hover:border-rose-200',
    },
  };

  const scheme = schemes[colorScheme];

  return (
    <div
      className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 ${scheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-extrabold text-slate-800 mt-1">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl border ${scheme.bgIcon}`}>
          {icon}
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
