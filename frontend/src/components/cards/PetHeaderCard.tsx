export default function PetHeaderCard() {
  return (
    <div className="card border border-green-400 bg-white">
      <div className="card-body p-3">

        <img
          src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4"
          alt="Mascota"
          className="rounded-xl h-56 object-cover"
        />

        <div className="flex justify-between items-center mt-3">
          <div>
            <h2 className="font-bold text-4xl text-gray-700">
              Tostada
            </h2>

            <p className="text-gray-500">
              Se creó el 17 de abril del 2026
            </p>
          </div>

          <button className="btn btn-ghost text-green-800 text-2xl">
            ✎
          </button>
        </div>

      </div>
    </div>
  );
}