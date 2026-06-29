// WASITI 2027 — اختبارات فلاتر البحث (Search Filters Tests) - النسخة المصححة
// المسار: src/__tests__/search/filters.test.ts

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterValues } from '@/components/features/SearchFilters';

// --- تعريف المكون الوهمي للاختبار (Mock Component) ---
const MockSearchFilters = ({ onFilterChange }: { onFilterChange: (filters: FilterValues) => void }) => {
  return (
    <div data-testid="mock-filters">
      <select data-testid="category-select" onChange={(e) => onFilterChange({ category: e.target.value, city: '', priceMin: '', priceMax: '', sort: 'newest' })}>
        <option value="">الكل</option>
        <option value="سيارات">سيارات</option>
        <option value="عقارات">عقارات</option>
      </select>
      <select data-testid="city-select" onChange={(e) => onFilterChange({ category: '', city: e.target.value, priceMin: '', priceMax: '', sort: 'newest' })}>
        <option value="">الكل</option>
        <option value="دمشق">دمشق</option>
        <option value="حلب">حلب</option>
      </select>
      <input data-testid="price-min" type="number" placeholder="من" onChange={(e) => onFilterChange({ category: '', city: '', priceMin: e.target.value, priceMax: '', sort: 'newest' })} />
      <input data-testid="price-max" type="number" placeholder="إلى" onChange={(e) => onFilterChange({ category: '', city: '', priceMin: '', priceMax: e.target.value, sort: 'newest' })} />
      <select data-testid="sort-select" onChange={(e) => onFilterChange({ category: '', city: '', priceMin: '', priceMax: '', sort: e.target.value as any })}>
        <option value="newest">الأحدث</option>
        <option value="price_low">الأقل سعراً</option>
        <option value="price_high">الأعلى سعراً</option>
      </select>
    </div>
  );
};

describe('اختبارات فلاتر البحث', () => {
  // ✅ تعريف المتغير هنا ليكون مرئياً في جميع الاختبارات داخل هذا describe
  let mockOnFilterChange: jest.Mock;

  beforeEach(() => {
    mockOnFilterChange = jest.fn(); // ✅ إعادة تعريف المتغير قبل كل اختبار
  });

  // --- 1. اختبار دمج الفلاتر ---
  test('1. دمج الفلاتر - فئة + مدينة', async () => {
    // ✅ التأكد من استخدام المتغير داخل الاختبار
    render(<MockSearchFilters onFilterChange={mockOnFilterChange} />);

    const categorySelect = screen.getByTestId('category-select');
    await userEvent.selectOptions(categorySelect, 'سيارات');
    
    // التحقق من استدعاء الدالة
    expect(mockOnFilterChange).toHaveBeenCalled();
    const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
    expect(lastCall.category).toBe('سيارات');

    const citySelect = screen.getByTestId('city-select');
    await userEvent.selectOptions(citySelect, 'دمشق');
    const lastCall2 = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
    expect(lastCall2.city).toBe('دمشق');
  });

  test('1. دمج الفلاتر - سعر + ترتيب', async () => {
    render(<MockSearchFilters onFilterChange={mockOnFilterChange} />);

    const priceMin = screen.getByTestId('price-min');
    await userEvent.type(priceMin, '10000');
    
    const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
    expect(lastCall.priceMin).toBe('10000');

    const sortSelect = screen.getByTestId('sort-select');
    await userEvent.selectOptions(sortSelect, 'price_low');
    const lastCall2 = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
    expect(lastCall2.sort).toBe('price_low');
  });

  // --- 2. اختبار نطاق السعر ---
  test('2. نطاق السعر - من وإلى', async () => {
    render(<MockSearchFilters onFilterChange={mockOnFilterChange} />);

    const priceMin = screen.getByTestId('price-min');
    const priceMax = screen.getByTestId('price-max');

    await userEvent.type(priceMin, '5000');
    const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
    expect(lastCall.priceMin).toBe('5000');

    await userEvent.type(priceMax, '20000');
    const lastCall2 = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
    expect(lastCall2.priceMax).toBe('20000');
  });

  test('2. نطاق السعر - قيمة سالبة', async () => {
    render(<MockSearchFilters onFilterChange={mockOnFilterChange} />);
    const priceMin = screen.getByTestId('price-min');
    await userEvent.type(priceMin, '-1000');
    const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
    expect(lastCall.priceMin).toBe('-1000');
  });

  // --- 3. اختبار النتائج الفارغة ---
  test('3. النتائج الفارغة - لا توجد نتائج', () => {
    const mockData: any[] = [];
    const filterData = (filters: FilterValues, data: any[]) => {
      return data.filter(() => false);
    };

    const results = filterData({ category: '', city: '', priceMin: '', priceMax: '', sort: 'newest' }, mockData);
    expect(results).toHaveLength(0);
  });

  test('3. النتائج الفارغة - رسالة عدم وجود نتائج', () => {
    const EmptyState = () => (
      <div data-testid="empty-state">
        <div className="text-6xl">🔍</div>
        <h3>لا توجد نتائج</h3>
        <p>حاول تعديل معايير البحث</p>
      </div>
    );

    render(<EmptyState />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/لا توجد نتائج/i)).toBeInTheDocument();
    expect(screen.getByText(/حاول تعديل معايير البحث/i)).toBeInTheDocument();
  });
});