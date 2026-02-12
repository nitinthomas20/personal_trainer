import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-8 w-8 border-2' };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className={`animate-spin rounded-full border-indigo-100 border-t-indigo-500 ${sizes[size]}`} />
      {message && <p className="mt-3 text-xs text-slate-400">{message}</p>}
    </div>
  );
};
