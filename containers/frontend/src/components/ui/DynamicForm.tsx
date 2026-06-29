'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Field {
  key: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
  submitLabel?: string;
  loading?: boolean;
}

export default function DynamicForm({
  fields,
  onSubmit,
  submitLabel = 'حفظ',
  loading = false,
}: DynamicFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {};
    fields.forEach(f => {
      const value = formData.get(f.key);
      data[f.key] = f.type === 'number' ? Number(value) : value;
    });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.key}>
          {field.type === 'select' ? (
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-100/90">{field.label}</label>
              <div className="relative">
                <select
                  name={field.key}
                  required={field.required}
                  className="w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-sky-400 transition-all appearance-none"
                >
                  <option value="" disabled>اختر...</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt} className="bg-[#1D3E66]">{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : field.type === 'boolean' ? (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name={field.key}
                className="w-5 h-5 rounded-lg border-white/30 bg-transparent checked:bg-sky-400 focus:ring-sky-400"
              />
              <span className="text-sm text-blue-100/80">{field.label}</span>
            </label>
          ) : field.type === 'textarea' ? (
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-100/90">{field.label}</label>
              <textarea
                name={field.key}
                required={field.required}
                placeholder={field.placeholder}
                rows={4}
                className="w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder:text-blue-300/50 outline-none focus:border-sky-400 transition-all resize-none"
              />
            </div>
          ) : (
            <Input
              label={field.label}
              name={field.key}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
      
      <Button type="submit" disabled={loading} size="lg" className="w-full mt-4">
        {loading ? 'جاري...' : submitLabel}
      </Button>
    </form>
  );
}