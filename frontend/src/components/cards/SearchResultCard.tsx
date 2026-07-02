// Misma imagen de respaldo que usa UserCard cuando no hay foto disponible
const DEFAULT_IMAGE =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_150.png";

interface SearchResultCardProps {
  name: string;
  typeLabel: string;
  imageUrl?: string;
}

export default function SearchResultCard({
  name,
  typeLabel,
  imageUrl,
}: SearchResultCardProps) {
  return (
    <div className="border border-green-400 bg-white rounded-xl p-3 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={imageUrl || DEFAULT_IMAGE} alt={name} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700!">{name}</h3>

          <p className="text-sm text-gray-500">{typeLabel}</p>
        </div>
      </div>

      <span className="text-green-800 text-2xl">›</span>
    </div>
  );
}