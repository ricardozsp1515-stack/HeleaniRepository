interface VetCardProps {
  name: string;
  subtitle: string;
}

export default function VetCard({
  name,
  subtitle,
}: VetCardProps) {
  return (
    <div className="border border-green-400 rounded-xl p-3 flex justify-between items-center">

      <div className="flex gap-3 items-center">

        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src="https://images.unsplash.com/photo-1644675272883-0c4d582528d8" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold">
            {name}
          </h3>

          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        </div>

      </div>

      <span className="text-green-800 text-2xl">
        ✉
      </span>
    </div>
  );
}