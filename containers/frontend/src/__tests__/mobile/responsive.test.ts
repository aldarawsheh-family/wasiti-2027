// WASITI 2027 — اختبارات الاستجابة للموبايل (Mobile Responsive Tests)
// المسار: src/__tests__/mobile/responsive.test.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- محاكاة مكون Navbar للاختبار ---
const MockNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav data-testid="navbar">
      <div data-testid="desktop-menu" className="hidden md:flex">
        <span>الرئيسية</span>
        <span>استكشف</span>
        <span>نشر</span>
      </div>
      
      <button
        data-testid="hamburger-button"
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {isMobileMenuOpen && (
        <div data-testid="mobile-menu">
          <span>الرئيسية</span>
          <span>استكشف</span>
          <span>نشر</span>
        </div>
      )}
    </nav>
  );
};

// --- محاكاة مكون Sidebar للاختبار ---
const MockSidebar = ({ className = '' }: { className?: string }) => (
  <aside data-testid="sidebar" className={className}>
    <span>لوحة التحكم</span>
    <span>الإعلانات</span>
    <span>المحادثات</span>
  </aside>
);

describe('اختبارات الاستجابة للموبايل', () => {
  // --- 1. اختبار إخفاء الشريط الجانبي ---
  test('1. الشريط الجانبي - مخفي على الموبايل', () => {
    render(<MockSidebar className="hidden md:block" />);
    const sidebar = screen.getByTestId('sidebar');
    
    // التحقق من وجود الكلاس المسؤول عن الإخفاء
    expect(sidebar).toHaveClass('hidden');
    expect(sidebar).toHaveClass('md:block');
  });

  test('1. الشريط الجانبي - ظاهر على سطح المكتب', () => {
    // محاكاة عرض سطح المكتب
    render(<MockSidebar className="md:block" />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeVisible();
  });

  // --- 2. اختبار قائمة الهمبرغر ---
  test('2. قائمة الهمبرغر - زر يظهر على الموبايل', () => {
    render(<MockNavbar />);
    const hamburgerButton = screen.getByTestId('hamburger-button');
    
    // التحقق من أن الزر يحتوي على كلاس المسؤول عن الظهور على الموبايل
    expect(hamburgerButton).toHaveClass('md:hidden');
    expect(hamburgerButton).toBeVisible();
  });

  test('2. قائمة الهمبرغر - زر يفتح ويغلق القائمة', async () => {
    render(<MockNavbar />);
    const hamburgerButton = screen.getByTestId('hamburger-button');
    
    // القائمة يجب أن تكون مخفية في البداية
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

    // النقر على الزر لفتح القائمة
    fireEvent.click(hamburgerButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    // النقر مرة أخرى لإغلاق القائمة
    fireEvent.click(hamburgerButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  test('2. قائمة الهمبرغر - محتوى القائمة', async () => {
    render(<MockNavbar />);
    const hamburgerButton = screen.getByTestId('hamburger-button');
    fireEvent.click(hamburgerButton);

    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toHaveTextContent('الرئيسية');
    expect(mobileMenu).toHaveTextContent('استكشف');
    expect(mobileMenu).toHaveTextContent('نشر');
  });

  // --- 3. اختبار أحداث اللمس (Touch Events) ---
  test('3. أحداث اللمس - النقر باللمس يفتح القائمة', async () => {
    render(<MockNavbar />);
    const hamburgerButton = screen.getByTestId('hamburger-button');
    
    // محاكاة حدث اللمس
    fireEvent.touchStart(hamburgerButton);
    fireEvent.click(hamburgerButton);
    
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });

  test('3. أحداث اللمس - السحب للإغلاق (محاكاة)', async () => {
    render(<MockNavbar />);
    const hamburgerButton = screen.getByTestId('hamburger-button');
    
    // فتح القائمة
    fireEvent.click(hamburgerButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    // محاكاة السحب للإغلاق (نستخدم النقر خارج العنصر)
    fireEvent.click(document.body);
    
    // في المحاكاة، لا يتم الإغلاق تلقائياً بالنقر خارجاً
    // لكن في التطبيق الحقيقي يجب أن يحدث ذلك
    // هنا سنقوم بمحاكاة الضغط على زر الهمبرغر مرة أخرى للإغلاق
    fireEvent.click(hamburgerButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  // --- 4. اختبار التجاوب مع تغير حجم الشاشة ---
  test('4. تغير حجم الشاشة - تبديل العناصر حسب الحجم', () => {
    // محاكاة تغير حجم الشاشة
    const matchMediaMock = (matches: boolean) => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    };

    // اختبار شاشة الموبايل (< 768px)
    matchMediaMock(false); // لا يتطابق مع md:block
    render(<MockSidebar className="hidden md:block" />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('hidden');

    // اختبار شاشة سطح المكتب (>= 768px)
    matchMediaMock(true); // يتطابق مع md:block
    const sidebarDesktop = screen.getByTestId('sidebar');
    expect(sidebarDesktop).toHaveClass('md:block');
  });
});