'use client';

import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'glass';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'primary',
  children,
  className = '',
}: BadgeProps) {
  const variantClasses = {
    primary: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    secondary: 'bg-white/10 text-blue-200 border-white/20',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    error: 'bg-red-500/20 text-red-300 border-red-400/30',
    glass: 'bg-white/10 backdrop-blur-md text-white border-white/20',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 
      text-[11px] font-bold 
      rounded-full border
      ${variantClasses[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
}