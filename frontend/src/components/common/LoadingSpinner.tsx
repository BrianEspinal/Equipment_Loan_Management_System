import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando datos...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-slate-500 gap-3 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};
