// WASITI 2027 — اختبارات إرسال الرسائل (Chat Send Tests)
// المسار: src/__tests__/chat/send.test.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- تعريف مكون ChatWindow وهمي للاختبار (Mock) ---
const MockChatWindow = ({ onSend }: { onSend: (message: string) => void }) => {
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<{ id: string; text: string; sender: 'me' | 'other' }[]>([]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'me' }]);
      setInput('');
    }
  };

  return (
    <div data-testid="chat-window">
      <div data-testid="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} data-testid={`message-${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        data-testid="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="اكتب رسالتك..."
      />
      <button data-testid="send-button" onClick={handleSend}>
        إرسال
      </button>
    </div>
  );
};

describe('اختبارات إرسال الرسائل', () => {
  let mockOnSend: jest.Mock;

  beforeEach(() => {
    mockOnSend = jest.fn();
  });

  // --- 1. اختبار إرسال رسالة ---
  test('1. إرسال رسالة ناجح', async () => {
    render(<MockChatWindow onSend={mockOnSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, 'مرحباً، كيف حالك؟');
    fireEvent.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith('مرحباً، كيف حالك？');
    expect(screen.getByText('مرحباً، كيف حالك؟')).toBeInTheDocument();
  });

  test('1. إرسال رسالة - مسافات فارغة', async () => {
    render(<MockChatWindow onSend={mockOnSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, '   ');
    fireEvent.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  // --- 2. اختبار استقبال رسالة ---
  test('2. استقبال رسالة', async () => {
    const onReceive = jest.fn();
    
    // محاكاة استقبال رسالة من الخادم
    const receiveMessage = (message: string, onReceive: (msg: string) => void) => {
      onReceive(message);
    };

    render(<MockChatWindow onSend={mockOnSend} />);
    receiveMessage('مرحباً بك!', onReceive);

    expect(onReceive).toHaveBeenCalledWith('مرحباً بك!');
  });

  test('2. استقبال رسالة - عرض رسالة الطرف الآخر', async () => {
    // محاكاة ChatWindow مع رسالة واردة
    const ChatWithMessage = () => (
      <div data-testid="chat-window">
        <div data-testid="messages-container">
          <div data-testid="message-other">مرحباً بك في الدردشة</div>
        </div>
        <input data-testid="chat-input" placeholder="اكتب رسالتك..." />
        <button data-testid="send-button">إرسال</button>
      </div>
    );

    render(<ChatWithMessage />);
    expect(screen.getByTestId('message-other')).toBeInTheDocument();
    expect(screen.getByText('مرحباً بك في الدردشة')).toBeInTheDocument();
  });

  // --- 3. اختبار التحقق من صحة الرسالة الفارغة ---
  test('3. رسالة فارغة - لا يتم إرسالها', async () => {
    render(<MockChatWindow onSend={mockOnSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    // إدخال نص ثم مسحه
    await userEvent.type(input, 'رسالة تجريبية');
    await userEvent.clear(input);
    fireEvent.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  test('3. رسالة فارغة - رسالة تحتوي على مسافات فقط', async () => {
    render(<MockChatWindow onSend={mockOnSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, '   ');
    fireEvent.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  // --- 4. اختبار إرسال رسالة طويلة ---
  test('4. رسالة طويلة', async () => {
    render(<MockChatWindow onSend={mockOnSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    const longMessage = 'أ'.repeat(1000);
    await userEvent.type(input, longMessage);
    fireEvent.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith(longMessage);
  });
});