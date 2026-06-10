const pets = [
    "/pet1.jpg",
    "/pet2.jpg",
    "/pet3.jpg",
    "/pet4.jpg",
    "/pet5.jpg",
    "/pet6.jpg",
];

export default function PetGallery() {
    return (
        <div>
            <h2 className="text-center text-3xl font-semibold text-gray-700 mb-6">
                Mascotas registradas
            </h2>

            <div className="bg-white rounded-3xl p-4">
                <div className="grid grid-cols-3 gap-4">
                    {pets.map((pet, index) => (
                        <img
                            key={index}
                            src={pet}
                            alt="Mascota"
                            className="
                                w-full
                                aspect-square
                                object-cover
                                rounded-xl
                            "
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}