'use client';

import React, { useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  position = 'right',
  className = '',
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const translateClass = position === 'right' 
    ? isOpen ? 'translate-x-0' : 'translate-x-full'
    : isOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 ${position === 'right' ? 'right-0' : 'left-0'}
          h-full w-[85%] max-w-[320px]
          bg-[#0F1F33]/95 backdrop-blur-2xl
          border-${position === 'right' ? 'l' : 'r'} border-white/20
          shadow-2xl
          z-50
          transition-transform duration-300 ease-in-out
          ${translateClass}
          ${className}
        `}
      >
        <div className="h-full overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}