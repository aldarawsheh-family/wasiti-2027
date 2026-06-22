// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Modal
// ══════════════════════════════════════════════════

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="glass p-6 rounded-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}