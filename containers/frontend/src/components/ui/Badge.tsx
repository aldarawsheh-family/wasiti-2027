// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Badge
// ══════════════════════════════════════════════════

export default function Badge({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`glass px-3 py-1 rounded-full text-xs text-gray-300 ${className}`}>
      {children}
    </span>
  );
}