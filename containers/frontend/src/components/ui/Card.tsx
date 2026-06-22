// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Card
// ══════════════════════════════════════════════════

export default function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}