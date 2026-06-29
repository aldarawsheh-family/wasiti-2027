'use client';

import React from 'react';

interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'underline',
}: TabsProps) {
  if (variant === 'pills') {
    return (
      <div className={`flex gap-2 p-1 bg-white/5 rounded-2xl ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-300
                ${isActive 
                  ? 'bg-sky-500/20 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                  : 'text-blue-200/50 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-sky-400/30 text-sky-200' : 'bg-white/10 text-blue-200/40'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex overflow-x-auto gap-6 border-b border-white/10 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              relative pb-3 text-sm font-medium transition-all duration-300
              flex items-center gap-2
              ${isActive 
                ? 'text-sky-300' 
                : 'text-blue-200/40 hover:text-white'
              }
            `}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-sky-400/20 text-sky-300' : 'bg-white/5 text-blue-200/30'
              }`}>
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}