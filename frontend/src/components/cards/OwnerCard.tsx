export default function OwnerCard() {
  return (
    <div className="border border-green-400 rounded-xl p-3 flex justify-between items-center">
      <div className="flex gap-3 items-center">

        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src="https://images.unsplash.com/photo-1618863898463-fa03d1cbb066" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">
            Nombre Apellido Apellido
          </h3>

          <p className="text-sm text-gray-500">
            example@gmail.com
          </p>
        </div>

      </div>

      <span className="text-green-800 text-2xl">
        ✉
      </span>
    </div>
  );
}