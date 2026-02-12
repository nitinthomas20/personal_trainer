import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, padding = 'md' }) => {
  const pad = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/50 ${onClick ? 'cursor-pointer hover:border-slate-200 hover:shadow-md transition-all' : ''} ${pad[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
