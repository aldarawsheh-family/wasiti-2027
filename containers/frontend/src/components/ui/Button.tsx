'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#00FF88] to-[#4ADE80] hover:from-[#00e67a] hover:to-[#3ccf6e] text-black font-semibold',
    secondary: 'bg-[var(--bg-card)] hover:bg-white/10 text-white border border-[var(--border-color)] backdrop-blur-md',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30',
    success: 'bg-gradient-to-r from-[#00FF88] to-[#4ADE80] hover:from-[#00e67a] hover:to-[#3ccf6e] text-black font-semibold',
    glass: 'bg-[var(--glass-bg)] backdrop-blur-xl hover:bg-white/10 text-white border border-[var(--border-color)]',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-full',
    md: 'px-5 py-2.5 text-sm rounded-full',
    lg: 'px-6 py-3.5 text-base rounded-full',
  };

  return (
    <button
      className={`
        transition-all duration-300
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        inline-flex items-center justify-center gap-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}