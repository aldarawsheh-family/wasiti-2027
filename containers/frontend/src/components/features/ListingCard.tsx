// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — ListingCard
// ══════════════════════════════════════════════════

import Card from '../ui/Card';

export default function ListingCard({
  id,
  title,
  city,
  image,
}: {
  id: string;
  title: string;
  city: string;
  image: string;
}) {
  return (
    <a href={`/ar/listing/${id}`}>
      <Card>
        <img src={image} className="w-full h-44 object-cover" alt={title} />
        <div className="p-4">
          <h3 className="font-bold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{city}</p>
        </div>
      </Card>
    </a>
  );
}