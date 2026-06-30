import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthenticatedLayout from "../components/layout/AuthLayout";
import PetHeaderCard from "../components/cards/PetHeaderCard";
import OwnerCard from "../components/cards/OwnerCard";
import { getPetById } from "../services/petService";

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  pet_type_name: string;
  image_url: string;
  created_at?: string;
  owner_name: string;
  owner_email: string;
  owner_image_url: string;
}

export default function PetProfile() {
  const { id } = useParams();

  const [pet, setPet] = useState<Pet | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getPetById(id)
      .then((data) => setPet(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <AuthenticatedLayout>
        <main className="p-8 pb-24">
          <p className="text-red-600 text-center">{error}</p>
        </main>
      </AuthenticatedLayout>
    );
  }

  if (!pet) {
    return (
      <AuthenticatedLayout>
        <main className="p-8 pb-24">
          <p className="text-center text-gray-500">Cargando...</p>
        </main>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <main className="p-8 pb-24">
        <PetHeaderCard
          name={pet.name}
          imageUrl={pet.image_url}
          createdAt={pet.created_at}
        />

        <div className="mt-8 border border-green-400 rounded-3xl p-4 flex flex-col gap-6 bg-white">
          {/* Encabezado */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-700">Información básica</h2>
          </div>

          {/* Datos básicos */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-green-400 rounded-xl p-2 text-center">
              <p className="text-sm text-gray-500">Especie</p>

              <p className="font-semibold">{pet.pet_type_name}</p>
            </div>

            <div className="border border-green-400 rounded-xl p-2 text-center">
              <p className="text-sm text-gray-500">Sexo</p>

              <p className="font-semibold">No registrado</p>
            </div>

            <div className="border border-green-400 rounded-xl p-2 text-center">
              <p className="text-sm text-gray-500">Edad</p>

              <p className="font-semibold">{pet.age}</p>
            </div>

            <div className="border border-green-400 rounded-xl p-2 text-center">
              <p className="text-sm text-gray-500">Peso</p>

              <p className="font-semibold">No registrado</p>
            </div>
          </div>

          {/* Dueño */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Dueño(a)</h3>

            <Link to="/profile">
              <OwnerCard
                name={pet.owner_name}
                email={pet.owner_email}
                imageUrl={pet.owner_image_url}
              />
            </Link>
          </section>

          {/* Condiciones */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Condiciones especiales
            </h3>

            <p className="text-center text-gray-500">
              Sin condiciones registradas
            </p>
          </section>

          {/* Exámenes */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Exámenes médicos
            </h3>

            <p className="text-center text-gray-500">
              Sin exámenes registrados
            </p>
          </section>

          {/* Veterinarios */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Registro de veterinarios y clínicas
            </h3>

            <p className="text-center text-gray-500">
              Sin veterinarios o clínicas registradas
            </p>
          </section>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}