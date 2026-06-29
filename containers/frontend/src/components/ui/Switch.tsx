'use client';

import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  className = '',
}: SwitchProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      className={`
        inline-flex items-center gap-3
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex h-7 w-12 items-center rounded-full
          transition-all duration-300 ease-in-out
          ${checked 
            ? 'bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]' 
            : 'bg-white/10 border border-white/20'
          }
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white
            transition-transform duration-300 ease-in-out
            shadow-md
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>

      {label && (
        <span className="text-sm text-blue-100/80 select-none">{label}</span>
      )}
    </label>
  );
}