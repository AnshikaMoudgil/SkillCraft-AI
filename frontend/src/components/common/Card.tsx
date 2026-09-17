import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'dark' | 'gradient-border';
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  isHoverable = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const variantStyles = {
    default: 'bg-white border border-slate-100 shadow-sm shadow-slate-200/50',
    elevated: 'bg-white border border-slate-100 shadow-md shadow-slate-200/60',
    glass: 'bg-white/80 backdrop-blur-md border border-white/40 shadow-sm',
    dark: 'bg-[#0B192C] border border-slate-800 text-white shadow-lg shadow-black/20',
    'gradient-border': 'bg-white relative p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 shadow-sm'
  }[variant];

  const hoverStyles = isHoverable
    ? 'hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100/80 cursor-pointer'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
