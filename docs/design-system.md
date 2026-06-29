# WASITI 2027 — Design System

## Themes
- Dark Mode (default)
- Light Mode (planned)

---

## Colors (Dark Theme - Default)

| Element | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary** | `#22c55e` | الألوان الرئيسية (الأزرار، الروابط، العناوين البارزة) |
| **Secondary** | `#60a5fa` | العناصر الثانوية (العناين الفرعية، حدود الحقول) |
| **Accent** | `#a78bfa` | لتمييز العناصر (الشارات، البادجات، الرموز) |
| **Success** | `#22c55e` | رسائل وحالات النجاح (تم الحفظ، تمت العملية) |
| **Warning** | `#facc15` | رسائل التحذير (تنبيهات، حاجة لتأكيد) |
| **Error** | `#ef4444` | رسائل الأخطاء (فشل العملية، خطأ في البيانات) |
| **Background Dark** | `#0a0f14` | الخلفية الرئيسية للصفحة |
| **Background Card** | `#111a20` | خلفية البطاقات والعناصر (أغمق قليلاً من الخلفية الرئيسية) |
| **Background Input** | `#1a252e` | خلفية حقول الإدخال والبحث |
| **Text Primary** | `#ffffff` | النصوص الرئيسية والعناوين |
| **Text Secondary** | `#9ca3af` | النصوص الفرعية، الوصف، والنصوص غير البارزة |
| **Border** | `#ffffff10` | حدود العناصر (شفافة قليلاً بمقدار 10%) |

---

## Colors (Light Theme - Future)
*(سيتم تحديدها لاحقاً عند بناء الثيم الفاتح)*

---

## Typography (الخطوط)

| Element | Font Family | Size | Weight |
| :--- | :--- | :--- | :--- |
| **Heading 1 (H1)** | `Cairo`, `Tajawal`, sans-serif | `3rem` (48px) | `700` (Bold) |
| **Heading 2 (H2)** | `Cairo`, `Tajawal`, sans-serif | `2.25rem` (36px) | `600` (Semi-Bold) |
| **Heading 3 (H3)** | `Cairo`, `Tajawal`, sans-serif | `1.5rem` (24px) | `600` (Semi-Bold) |
| **Body Text** | `Cairo`, `Tajawal`, sans-serif | `1rem` (16px) | `400` (Regular) |
| **Small Text** | `Cairo`, `Tajawal`, sans-serif | `0.875rem` (14px) | `400` (Regular) |

*(ملاحظة: يجب تحميل خط `Cairo` من Google Fonts في ملف `globals.css` أو `layout.tsx`)*

---

## Spacing (المسافات)

| Unit | Value | Usage |
| :--- | :--- | :--- |
| `spacing-1` | `4px` | أصغر مسافة بين العناصر |
| `spacing-2` | `8px` | مسافة صغيرة (حول الأيقونات) |
| `spacing-3` | `12px` | مسافة متوسطة (حول الأزرار) |
| `spacing-4` | `16px` | مسافة أساسية (الـ padding الافتراضي للبطاقات) |
| `spacing-6` | `24px` | مسافة كبيرة (هوامش الأقسام) |
| `spacing-8` | `32px` | مسافة كبيرة جداً (بين الأقسام الكبيرة) |

---

## Borders & Radius (الحدود والزوايا)

| Element | Value | Usage |
| :--- | :--- | :--- |
| **Border Width** | `1px` | سمك الحدود الافتراضي |
| **Border Radius (SM)** | `8px` | زوايا صغيرة (للأزرار الصغيرة، والشارات) |
| **Border Radius (MD)** | `12px` | زوايا متوسطة (للبطاقات، حقول الإدخال) |
| **Border Radius (LG)** | `16px` | زوايا كبيرة (للنوافذ المنبثقة، الحاويات الكبيرة) |
| **Border Radius (Full)** | `9999px` | زوايا دائرية بالكامل (للأزرار الدائرية، الشعارات) |

---

## Shadows & Effects (الظلال والتأثيرات)

| Effect | CSS Value | Usage |
| :--- | :--- | :--- |
| **Glassmorphism** | `background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(18px);` | الخلفيات الزجاجية (للنوافذ المنبثقة، الألواح الجانبية) |
| **Float Animation** | `animation: float 12s ease-in-out infinite;` | تحريك العناصر بشكل عائم (للشعارات، الصور) |
| **Hover Effect** | `transform: translateY(-6px);` | تأثير تحريك العنصر للأعلى عند التمرير بالماوس |
| **Card Shadow** | `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);` | ظل ناعم للبطاقات والعناصر |

---

## Components (المكونات)

- **GlassPanel**: لوحة بخلفية زجاجية
- **Card**: بطاقة لعرض المعلومات
- **Button**: أزرار (رئيسي، ثانوي، خطير، ناجح)
- **Input**: حقول إدخال النصوص والأرقام
- **Modal**: نوافذ منبثقة للتأكيد أو الإدخال
- **Badge**: شارات صغيرة لعرض الإحصائيات أو الحالات
- **Avatar**: صور رمزية للمستخدمين
- **DynamicForm**: نموذج ديناميكي يتغير بناءً على البيانات

---

## File Structure for Design System

```text
styles/
├── tokens.css        (المتغيرات: الألوان، المسافات، الخطوط)
├── globals.css       (التنسيقات العامة)
├── themes.css        (الثيم الداكن والفاتح)
└── components/       (ملفات CSS الخاصة بكل مكون)