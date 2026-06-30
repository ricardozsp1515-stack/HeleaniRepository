interface PetHeaderCardProps {
  name: string;
  imageUrl: string;
  createdAt?: string;
}

export default function PetHeaderCard({
  name,
  imageUrl,
  createdAt,
}: PetHeaderCardProps) {

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="card border border-green-400 bg-white">
      <div className="card-body p-3">

        <img
          src={imageUrl}
          alt={name}
          className="rounded-xl h-56 object-cover"
        />

        <div className="flex justify-between items-center mt-3">
          <div>
            <h2 className="font-bold text-4xl text-gray-700">
              {name}
            </h2>

            {formattedDate && (
              <p className="text-gray-500">
                Se creó el {formattedDate}
              </p>
            )}
          </div>

          <button className="btn btn-ghost text-green-800 text-2xl">
            ✎
          </button>
        </div>

      </div>
    </div>
  );
}