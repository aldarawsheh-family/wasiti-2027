// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Avatar
// ══════════════════════════════════════════════════

export default function Avatar({
  src,
  alt = '',
  size = 'md',
}: {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden glass`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>
      )}
    </div>
  );
}