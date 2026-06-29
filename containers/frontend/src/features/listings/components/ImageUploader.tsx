'use client';

import { useState } from 'react';
import { uploadImage } from '../images/upload';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  multiple?: boolean;
  className?: string;
}

export default function ImageUploader({
  onUpload,
  multiple = false,
  className = '',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setError(null);
    setUploading(true);

    try {
      const url = await uploadImage(file);
      setUploading(false);
      onUpload(url);
    } catch (err: any) {
      setUploading(false);
      setError(err.message || 'فشل رفع الصورة');
    }
  };

  return (
    <div className={`bg-[#111a20] border border-[#ffffff10] rounded-2xl p-6 text-center ${className}`}>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleUpload}
        className="hidden"
        id="image-upload"
        disabled={uploading}
      />
      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="معاينة الصورة"
            className="w-full h-32 object-cover rounded-xl border border-[#ffffff10]"
          />
        </div>
      )}
      {error && (
        <div className="text-sm text-[#ef4444] mb-2">{error}</div>
      )}
      <label
        htmlFor="image-upload"
        className={`
          cursor-pointer bg-gradient-to-r from-[#22c55e] to-[#818cf8] text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          inline-block
        `}
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            جاري الرفع...
          </span>
        ) : (
          <span>📸 {multiple ? 'رفع صور' : 'رفع صورة'}</span>
        )}
      </label>
    </div>
  );
}