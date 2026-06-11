import { Link } from "react-router-dom";

const pets = [
    "https://images.unsplash.com/photo-1519052537078-e6302a4968d4",
    "https://images.unsplash.com/photo-1517423568366-8b83523034fd",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a",
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e",
    "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
    "https://images.unsplash.com/photo-1695591334295-f826fd974265"
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
                        <Link
                            key={index}
                            to="/pet-profile"
                        >
                            <img
                                src={pet}
                                alt="Mascota"
                                className="
                                    w-full
                                    aspect-square
                                    object-cover
                                    rounded-xl
                                    hover:scale-105
                                    transition-transform
                                    cursor-pointer
                                "
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}