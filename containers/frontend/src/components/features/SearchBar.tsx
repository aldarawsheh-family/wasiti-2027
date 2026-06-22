// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — SearchBar
// ══════════════════════════════════════════════════

export default function SearchBar() {
  return (
    <div className="flex gap-2">
      <input
        className="input flex-1"
        placeholder="ابحث عن سيارة، عقار، خدمة..."
      />
      <button className="bg-green-500 text-black px-6 rounded-xl font-bold">
        بحث
      </button>
    </div>
  );
}