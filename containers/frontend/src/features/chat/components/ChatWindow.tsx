// WASITI 2027 — ChatWindow
// المسار: components/features/ChatWindow.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  userId: string;
  className?: string;
}

export default function ChatWindow({
  conversationId,
  userId,
  className = '',
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // محاكاة جلب الرسائل
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          senderId: 'user2',
          senderName: 'أحمد المحمد',
          content: 'مرحباً، كم سعر هذه السيارة؟',
          timestamp: '10:30 صباحاً',
          read: true,
        },
        {
          id: '2',
          senderId: userId,
          senderName: 'أنت',
          content: 'مرحباً أحمد، السعر 25,000 دولار',
          timestamp: '10:32 صباحاً',
          read: true,
        },
        {
          id: '3',
          senderId: 'user2',
          senderName: 'أحمد المحمد',
          content: 'هل يمكن التفاوض على السعر؟',
          timestamp: '10:35 صباحاً',
          read: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [conversationId, userId]);

  // التمرير للأسفل تلقائياً
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // إرسال رسالة
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: userId,
      senderName: 'أنت',
      content: input,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // محاكاة رد تلقائي
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'user2',
        senderName: 'أحمد المحمد',
        content: 'شكراً لك، سأفكر في الأمر',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-[500px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] overflow-hidden ${className}`}>
      {/* رأس المحادثة */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-input)]/50">
        <div className="flex items-center gap-3">
          <Avatar name="أحمد المحمد" size="sm" />
          <div>
            <h3 className="text-[var(--text-main)] font-bold">أحمد المحمد</h3>
            <p className="text-xs text-[var(--text-secondary)]">متصل الآن</p>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
            جاري تحميل المحادثة...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
            لا توجد رسائل بعد. ابدأ المحادثة!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === userId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[70%] p-3 rounded-[var(--radius-lg)]
                    ${isMe 
                      ? 'bg-[var(--color-primary)] text-black' 
                      : 'bg-[var(--bg-input)] text-[var(--text-main)]'
                    }
                  `}
                >
                  {!isMe && (
                    <div className="text-xs font-bold text-[var(--text-secondary)] mb-1">
                      {msg.senderName}
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? 'text-black/60' : 'text-[var(--text-secondary)]'}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <span>{msg.read ? '✓✓' : '✓'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* حقل الإدخال */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-input)]/50">
        <div className="flex gap-2">
          <Input
            placeholder="اكتب رسالتك..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button variant="primary" onClick={handleSend}>
            إرسال
          </Button>
        </div>
      </div>
    </div>
  );
}