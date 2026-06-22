// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Input
// ══════════════════════════════════════════════════

export default function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input ${className}`}
    />
  );
}