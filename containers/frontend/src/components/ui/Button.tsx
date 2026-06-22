// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Button
// ══════════════════════════════════════════════════

export default function Button({
  children,
  onClick,
  className = '',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-3 px-5 rounded-xl hover:scale-105 transition-transform ${className}`}
    >
      {children}
    </button>
  );
}