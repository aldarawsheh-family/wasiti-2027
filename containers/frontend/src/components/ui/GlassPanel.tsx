// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — GlassPanel
// ══════════════════════════════════════════════════

export default function GlassPanel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass ${className}`}>
      {children}
    </div>
  );
}