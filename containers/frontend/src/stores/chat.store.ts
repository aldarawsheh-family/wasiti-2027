// ══════════════════════════════════════════════════
// WASITI 2027 — Chat Store
// ══════════════════════════════════════════════════

import { create } from 'zustand';

interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
}

interface ChatState {
  rooms: any[];
  messages: Record<string, Message[]>;
  activeRoom: string | null;
  setRooms: (rooms: any[]) => void;
  setActiveRoom: (roomId: string | null) => void;
  addMessage: (roomId: string, message: Message) => void;
  setMessages: (roomId: string, messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  messages: {},
  activeRoom: null,
  setRooms: (rooms) => set({ rooms }),
  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    })),
  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [roomId]: messages },
    })),
}));