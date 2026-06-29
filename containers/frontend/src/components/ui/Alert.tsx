'use client';

import React from 'react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}: AlertProps) {
  const icons = {
    info: <Info size={20} className="text-sky-300" />,
    success: <CheckCircle size={20} className="text-emerald-300" />,
    warning: <AlertTriangle size={20} className="text-amber-300" />,
    error: <XCircle size={20} className="text-red-300" />,
  };

  const variantColors = {
    info: 'border-sky-400/30 bg-sky-500/10',
    success: 'border-emerald-400/30 bg-emerald-500/10',
    warning: 'border-amber-400/30 bg-amber-500/10',
    error: 'border-red-400/30 bg-red-500/10',
  };

  const textColors = {
    info: 'text-sky-200',
    success: 'text-emerald-200',
    warning: 'text-amber-200',
    error: 'text-red-200',
  };

  return (
    <div
      className={`
        w-full
        backdrop-blur-md
        border
        rounded-2xl
        p-4
        flex items-start gap-3
        ${variantColors[variant]}
        ${className}
      `}
    >
      <div className="shrink-0 mt-0.5">{icons[variant]}</div>
      
      <div className="flex-1">
        <div className={`font-medium text-sm ${textColors[variant]}`}>{title}</div>
        {children && (
          <div className="text-sm mt-1 text-blue-100/60">{children}</div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white/80"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}