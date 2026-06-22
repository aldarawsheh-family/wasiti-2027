// ══════════════════════════════════════════════════
// WASITI 2027 — Chat Page
// ══════════════════════════════════════════════════

import Navbar from '@/components/layout/Navbar';
import ChatWindow from '@/components/features/ChatWindow';

export default function ChatPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">💬 المحادثات</h1>
        <ChatWindow />
      </main>
    </>
  );
}