'use client';

import React from 'react';

type InputSize = 'sm' | 'md' | 'lg';

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize;
  error?: string;
  label?: string;
  icon?: React.ReactNode;
};

export default function Input({
  size = 'md',
  error,
  label,
  icon,
  className = '',
  disabled,
  ...rest
}: InputProps) {
  const sizeClasses: Record<InputSize, string> = {
    sm: 'px-3 py-2 text-sm rounded-full',
    md: 'px-4 py-3 text-base rounded-full',
    lg: 'px-6 py-4 text-lg rounded-full',
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
          {icon && <span className="text-[var(--color-primary)]">{icon}</span>}
          {label}
        </label>
      )}
      
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
        <input
          className={`
            relative w-full
            bg-[var(--bg-input)] backdrop-blur-md
            border
            text-white
            outline-none
            transition-all duration-300
            placeholder:text-[var(--text-secondary)]
            ${error 
              ? 'border-red-400/50 focus:border-red-400' 
              : 'border-[var(--border-color)] focus:border-[var(--color-primary)]'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${sizeClasses[size]}
            ${className}
          `}
          disabled={disabled}
          {...rest}
        />
      </div>
      
      {error && (
        <span className="text-sm text-red-300 mt-1 flex items-center gap-1">
          {error}
        </span>
      )}
    </div>
  );
}