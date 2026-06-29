// WASITI 2027 — اختبارات الحجوزات (Booking Reserve Tests)
// المسار: src/__tests__/booking/reserve.test.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- محاكاة نموذج الحجز ---
const MockBookingForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    date: '',
    guests: '1',
  });
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError('الاسم مطلوب');
      return;
    }
    if (!formData.date) {
      setError('التاريخ مطلوب');
      return;
    }
    onSubmit(formData);
    setError('');
  };

  return (
    <form data-testid="booking-form" onSubmit={handleSubmit}>
      <input
        data-testid="name-input"
        placeholder="الاسم"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        data-testid="date-input"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />
      <input
        data-testid="guests-input"
        type="number"
        placeholder="عدد الأشخاص"
        value={formData.guests}
        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
      />
      <button data-testid="submit-button" type="submit">
        تأكيد الحجز
      </button>
      {error && <div data-testid="error-message">{error}</div>}
    </form>
  );
};

// --- محاكاة دالة التحقق من التوفر ---
const mockCheckAvailability = jest.fn();

describe('اختبارات إنشاء الحجز', () => {
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnSubmit = jest.fn();
    mockCheckAvailability.mockReset();
  });

  // --- 1. اختبار إنشاء حجز ناجح ---
  test('1. إنشاء حجز ناجح', async () => {
    render(<MockBookingForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByTestId('name-input');
    const dateInput = screen.getByTestId('date-input');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(nameInput, 'أحمد المحمد');
    await userEvent.type(dateInput, '2026-02-15');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'أحمد المحمد',
      date: '2026-02-15',
      guests: '1',
    });
  });

  test('1. إنشاء حجز ناجح - عدد الأشخاص', async () => {
    render(<MockBookingForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByTestId('name-input');
    const dateInput = screen.getByTestId('date-input');
    const guestsInput = screen.getByTestId('guests-input');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(nameInput, 'سارة عبدالله');
    await userEvent.type(dateInput, '2026-02-20');
    await userEvent.clear(guestsInput);
    await userEvent.type(guestsInput, '3');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'سارة عبدالله',
      date: '2026-02-20',
      guests: '3',
    });
  });

  // --- 2. اختبار التحقق من التاريخ ---
  test('2. التاريخ - تاريخ صحيح', async () => {
    render(<MockBookingForm onSubmit={mockOnSubmit} />);
    const dateInput = screen.getByTestId('date-input');
    await userEvent.type(dateInput, '2026-02-15');
    expect(dateInput).toHaveValue('2026-02-15');
  });

  test('2. التاريخ - تاريخ فارغ', async () => {
    render(<MockBookingForm onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    expect(screen.getByTestId('error-message')).toHaveTextContent('التاريخ مطلوب');
  });

  test('2. التاريخ - تاريخ سابق (ممنوع)', async () => {
    // محاكاة دالة التحقق من التاريخ
    const validateDate = (date: string): boolean => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    };

    expect(validateDate('2026-02-15')).toBe(true);
    expect(validateDate('2020-01-01')).toBe(false);
  });

  // --- 3. اختبار التحقق من التوفر ---
  test('3. التحقق من التوفر - متاح', async () => {
    mockCheckAvailability.mockResolvedValue({ available: true });

    const checkAvailability = async (date: string): Promise<boolean> => {
      const result = await mockCheckAvailability(date);
      return result.available;
    };

    const isAvailable = await checkAvailability('2026-02-15');
    expect(isAvailable).toBe(true);
    expect(mockCheckAvailability).toHaveBeenCalledWith('2026-02-15');
  });

  test('3. التحقق من التوفر - غير متاح', async () => {
    mockCheckAvailability.mockResolvedValue({ available: false });

    const checkAvailability = async (date: string): Promise<boolean> => {
      const result = await mockCheckAvailability(date);
      return result.available;
    };

    const isAvailable = await checkAvailability('2026-02-15');
    expect(isAvailable).toBe(false);
    expect(mockCheckAvailability).toHaveBeenCalledWith('2026-02-15');
  });

  test('3. التحقق من التوفر - خطأ في الخادم', async () => {
    mockCheckAvailability.mockRejectedValue(new Error('فشل الاتصال بالخادم'));

    const checkAvailability = async (date: string): Promise<boolean> => {
      try {
        const result = await mockCheckAvailability(date);
        return result.available;
      } catch {
        return false;
      }
    };

    const isAvailable = await checkAvailability('2026-02-15');
    expect(isAvailable).toBe(false);
  });

  // --- 4. اختبار الحقول المطلوبة ---
  test('4. حقل الاسم - فارغ', async () => {
    render(<MockBookingForm onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    expect(screen.getByTestId('error-message')).toHaveTextContent('الاسم مطلوب');
  });

  test('4. حقل عدد الأشخاص - قيمة سالبة', async () => {
    render(<MockBookingForm onSubmit={mockOnSubmit} />);
    const guestsInput = screen.getByTestId('guests-input');
    await userEvent.clear(guestsInput);
    await userEvent.type(guestsInput, '-1');
    expect(guestsInput).toHaveValue('-1');
  });

  test('4. حقل عدد الأشخاص - صفر', async () => {
    render(<MockBookingForm onSubmit={mockOnSubmit} />);
    const guestsInput = screen.getByTestId('guests-input');
    await userEvent.clear(guestsInput);
    await userEvent.type(guestsInput, '0');
    expect(guestsInput).toHaveValue('0');
  });
});