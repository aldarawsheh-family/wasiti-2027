'use client';

import { useEffect } from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-400/30',
      text: 'text-emerald-200',
      icon: <CheckCircle size={20} className="text-emerald-300" />,
    },
    error: {
      bg: 'bg-red-500/20',
      border: 'border-red-400/30',
      text: 'text-red-200',
      icon: <XCircle size={20} className="text-red-300" />,
    },
    info: {
      bg: 'bg-sky-500/20',
      border: 'border-sky-400/30',
      text: 'text-sky-200',
      icon: <Info size={20} className="text-sky-300" />,
    },
  };

  const { bg, border, text, icon } = config[type];

  return (
    <div className={`
      fixed top-4 right-4 z-[200] 
      px-5 py-3.5 
      rounded-2xl 
      backdrop-blur-xl
      border
      shadow-2xl
      flex items-center gap-3
      animate-in slide-in-from-right fade-in duration-300
      ${bg} ${border}
    `}>
      {icon}
      <span className={`text-sm font-medium ${text}`}>{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors ml-2"
      >
        <X size={16} className={text} />
      </button>
    </div>
  );
}