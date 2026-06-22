// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — DynamicForm
// ══════════════════════════════════════════════════

export default function DynamicForm({
  fields,
  onSubmit,
}: {
  fields: { key: string; label: string; type: string; options?: string[] }[];
  onSubmit: (data: any) => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {};
    fields.forEach(f => { data[f.key] = formData.get(f.key); });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.key}>
          <label className="text-gray-300 text-sm block mb-1">{field.label}</label>
          {field.type === 'select' ? (
            <select name={field.key} className="input">
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === 'boolean' ? (
            <input type="checkbox" name={field.key} className="w-5 h-5" />
          ) : (
            <input type={field.type} name={field.key} className="input" />
          )}
        </div>
      ))}
      <button type="submit" className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold w-full">
        حفظ
      </button>
    </form>
  );
}