'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}: CheckboxProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      className={`
        flex items-center gap-3 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div
        onClick={handleChange}
        className={`
          relative w-5 h-5 shrink-0
          border-2 rounded-lg
          transition-all duration-300
          flex items-center justify-center
          ${checked 
            ? 'bg-sky-400 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
            : 'bg-transparent border-white/30 hover:border-white/50'
          }
        `}
      >
        {checked && (
          <Check size={12} className="text-white" strokeWidth={3} />
        )}
      </div>
      
      {label && (
        <span className="text-sm text-blue-100/80">
          {label}
        </span>
      )}
    </label>
  );
}