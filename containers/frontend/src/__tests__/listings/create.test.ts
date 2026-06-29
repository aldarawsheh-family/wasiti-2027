// WASITI 2027 — اختبارات إنشاء الإعلانات (Listings Create Tests)
// المسار: src/__tests__/listings/create.test.tsx

import { validateListingForm } from '@/lib/security/validation';

describe('اختبارات إنشاء إعلان جديد', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. التحقق من صحة النموذج (Validation) ---
  test('1. التحقق من صحة النموذج - بيانات صحيحة', () => {
    const validData = {
      title: 'سيارة تويوتا كورولا 2020',
      description: 'سيارة بحالة ممتازة، استعمال عائلي، صيانة دورية في الوكالة.',
      price: 25000,
      city: 'دمشق',
      category: 'سيارات',
    };

    const result = validateListingForm(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('1. التحقق من صحة النموذج - عنوان قصير جداً', () => {
    const invalidData = {
      title: 'سيارة',
      description: 'سيارة بحالة ممتازة، استعمال عائلي.',
      price: 25000,
      city: 'دمشق',
      category: 'سيارات',
    };

    const result = validateListingForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe('العنوان يجب أن يكون 5 أحرف على الأقل');
  });

  test('1. التحقق من صحة النموذج - وصف قصير جداً', () => {
    const invalidData = {
      title: 'سيارة تويوتا كورولا 2020',
      description: 'سيارة ممتازة',
      price: 25000,
      city: 'دمشق',
      category: 'سيارات',
    };

    const result = validateListingForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.description).toBe('الوصف يجب أن يكون 20 حرفاً على الأقل');
  });

  test('1. التحقق من صحة النموذج - سعر غير صالح (صفر)', () => {
    const invalidData = {
      title: 'سيارة تويوتا كورولا 2020',
      description: 'سيارة بحالة ممتازة، استعمال عائلي.',
      price: 0,
      city: 'دمشق',
      category: 'سيارات',
    };

    const result = validateListingForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.price).toBe('السعر يجب أن يكون أكبر من صفر');
  });

  test('1. التحقق من صحة النموذج - مدينة فارغة', () => {
    const invalidData = {
      title: 'سيارة تويوتا كورولا 2020',
      description: 'سيارة بحالة ممتازة، استعمال عائلي.',
      price: 25000,
      city: '',
      category: 'سيارات',
    };

    const result = validateListingForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.city).toBe('المدينة مطلوبة');
  });

  test('1. التحقق من صحة النموذج - فئة غير محددة', () => {
    const invalidData = {
      title: 'سيارة تويوتا كورولا 2020',
      description: 'سيارة بحالة ممتازة، استعمال عائلي.',
      price: 25000,
      city: 'دمشق',
      category: '',
    };

    const result = validateListingForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.category).toBe('الفئة مطلوبة');
  });

  // --- 2. اختبار رفع الصور (Image Upload Limit) ---
  test('2. حد رفع الصور - عدد الصور المسموح به', () => {
    // محاكاة دالة التحقق من عدد الصور
    const validateImageLimit = (images: File[], max: number = 10): boolean => {
      return images.length <= max;
    };

    const validImages = Array.from({ length: 5 }, () => new File([''], 'test.jpg'));
    const tooManyImages = Array.from({ length: 15 }, () => new File([''], 'test.jpg'));

    expect(validateImageLimit(validImages)).toBe(true);
    expect(validateImageLimit(tooManyImages)).toBe(false);
  });

  test('2. حد رفع الصور - حجم الصورة', () => {
    // محاكاة دالة التحقق من حجم الصورة (5MB كحد أقصى)
    const validateImageSize = (file: File, maxSizeMB: number = 5): boolean => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return file.size <= maxSizeBytes;
    };

    const smallFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(smallFile, 'size', { value: 2 * 1024 * 1024 }); // 2MB

    const largeFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 }); // 10MB

    expect(validateImageSize(smallFile)).toBe(true);
    expect(validateImageSize(largeFile)).toBe(false);
  });

  // --- 3. اختبار التحقق من السعر (Price Validation) ---
  test('3. التحقق من السعر - سعر صحيح', () => {
    const validatePrice = (price: number): boolean => {
      return price > 0 && Number.isFinite(price);
    };

    expect(validatePrice(25000)).toBe(true);
    expect(validatePrice(0.01)).toBe(true);
    expect(validatePrice(0)).toBe(false);
    expect(validatePrice(-100)).toBe(false);
    expect(validatePrice(NaN)).toBe(false);
    expect(validatePrice(Infinity)).toBe(false);
  });

  test('3. التحقق من السعر - تنسيق السعر', () => {
    const formatPrice = (price: number, currency: string = '$'): string => {
      return `${currency} ${price.toLocaleString('ar-SA')}`;
    };

    expect(formatPrice(25000)).toBe('$ 25,000');
    expect(formatPrice(1000)).toBe('$ 1,000');
    expect(formatPrice(5000000)).toBe('$ 5,000,000');
  });
});