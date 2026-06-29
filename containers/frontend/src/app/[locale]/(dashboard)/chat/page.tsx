'use client';

import React, { useState, useEffect } from 'react';
import ConversationsList, { Conversation } from '@/features/chat/components/ConversationsList';
import ChatWindow from '@/features/chat/components/ChatWindow';
import Button from '@/components/ui/Button';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function ChatPage() {
  const userId = 'user1';
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setConversations([
        { id: 'conv1', name: 'أحمد المحمد', avatar: '', lastMessage: 'شكراً لك، سأفكر في الأمر', timestamp: '10:35 صباحاً', unread: 2 },
        { id: 'conv2', name: 'سارة عبدالله', avatar: '', lastMessage: 'متى يمكننا الاجتماع؟', timestamp: '09:20 صباحاً', unread: 0 },
        { id: 'conv3', name: 'محمد علي', avatar: '', lastMessage: 'تم إرسال العرض', timestamp: 'أمس', unread: 1 },
      ]);
      setActiveId('conv1');
      setLoading(false);
    }, 1000);
  }, []);

  if (isMobile && !activeId) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] text-white relative">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center shadow-[var(--shadow-neon)]">
              <MessageCircle size={20} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">المحادثات</h1>
          </div>
          <ConversationsList conversations={conversations} activeId={activeId || undefined} onSelect={setActiveId} loading={loading} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white relative h-[calc(100vh-4rem)]">
      <div className="flex h-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden m-0 md:m-4">
        <div className={`${isMobile && activeId ? 'hidden' : 'w-full md:w-80'} border-r border-[var(--border-color)] flex flex-col`}>
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center">
                <MessageCircle size={16} className="text-black" />
              </div>
              <h2 className="text-lg font-bold text-white">المحادثات</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <ConversationsList conversations={conversations} activeId={activeId || undefined} onSelect={setActiveId} loading={loading} />
          </div>
        </div>

        <div className={`${isMobile && !activeId ? 'hidden' : 'flex-1'} flex flex-col`}>
          {activeId ? (
            <>
              {isMobile && (
                <div className="p-3 border-b border-[var(--border-color)]">
                  <Button variant="glass" size="sm" onClick={() => setActiveId(null)}><ArrowRight size={16} className="rotate-180" /> عودة</Button>
                </div>
              )}
              <div className="flex-1 p-4">
                <ChatWindow conversationId={activeId} userId={userId} className="h-full" />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)]">
              <MessageCircle size={48} />
              <span>اختر محادثة لبدء الدردشة</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}