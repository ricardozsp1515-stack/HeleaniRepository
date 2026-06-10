export default function UserCard() {
    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm">
            <img
                src="/profile.jpg"
                alt="Perfil"
                className="w-full h-44 object-cover rounded-2xl"
            />

            <div className="mt-4">
                <h2 className="text-3xl font-semibold text-gray-700">
                    Nombre Apellido Apellido
                </h2>

                <p className="text-gray-500 mt-2">
                    Se unió el 17 de abril del 2026
                </p>
            </div>
        </div>
    );
}