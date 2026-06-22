// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — CreateListingForm
// ══════════════════════════════════════════════════

import DynamicForm from '../ui/DynamicForm';

export default function CreateListingForm() {
  const fields = [
    { key: 'title_ar', label: 'العنوان (عربي)', type: 'text' },
    { key: 'title_en', label: 'Title (English)', type: 'text' },
    { key: 'price', label: 'السعر', type: 'number' },
    { key: 'city_ar', label: 'المدينة', type: 'text' },
    { key: 'category', label: 'الفئة', type: 'select', options: ['سيارات', 'عقارات', 'موبايلات', 'خدمات'] },
  ];

  return (
    <div className="glass p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-4 text-white">📝 نشر إعلان جديد</h2>
      <DynamicForm fields={fields} onSubmit={data => console.log(data)} />
    </div>
  );
}