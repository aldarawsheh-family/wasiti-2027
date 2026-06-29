// WASITI 2027 — ConversationsList
// المسار: components/features/ConversationsList.tsx

'use client';

import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ConversationsListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  loading?: boolean;
  className?: string;
}

export default function ConversationsList({
  conversations,
  activeId,
  onSelect,
  loading = false,
  className = '',
}: ConversationsListProps) {
  // حالة التحميل
  if (loading) {
    return (
      <div className={`space-y-3 p-4 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-card)] rounded-[var(--radius-lg)]">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton height="16px" width="60%" />
              <Skeleton height="14px" width="80%" />
            </div>
            <Skeleton height="16px" width="40px" className="rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // حالة عدم وجود محادثات
  if (conversations.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-[var(--text-main)] font-bold">لا توجد محادثات</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          ابدأ محادثة جديدة مع بائع أو مشتري
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {conversations.map((conv) => {
        const isActive = conv.id === activeId;

        return (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`
              flex items-center gap-3 p-3 rounded-[var(--radius-lg)] cursor-pointer transition-all duration-200
              ${isActive 
                ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30' 
                : 'hover:bg-[var(--bg-input)] border border-transparent'
              }
            `}
          >
            <Avatar src={conv.avatar} name={conv.name} size="md" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[var(--text-main)] font-medium truncate">
                  {conv.name}
                </h4>
                <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                  {conv.timestamp}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-sm text-[var(--text-secondary)] truncate max-w-[70%]">
                  {conv.lastMessage}
                </p>
                {conv.unread > 0 && (
                  <Badge variant="primary" className="text-xs px-2 py-0.5">
                    {conv.unread}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}