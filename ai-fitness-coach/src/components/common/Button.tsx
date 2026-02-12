import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon,
}) => {
  const base = 'inline-flex items-center justify-center gap-1.5 font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/50 hover:brightness-105 active:scale-[0.98]',
    secondary: 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-200/50 hover:shadow-lg',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/50 hover:shadow-lg',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
