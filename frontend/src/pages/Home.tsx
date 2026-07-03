import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthenticatedLayout from "../components/layout/AuthLayout";
import CarouselSection from "../components/layout/CarouselSection";
import ProfileIconCard from "../components/cards/ProfileIconCard";

import { getAllVets } from "../services/vetService";
import { getAllCenters } from "../services/centerService";

interface Vet {
  id: string;
  name: string;
  image_url: string;
}

interface Center {
  id: string;
  name: string;
  image_url: string;
}

export default function Home() {
  const navigate = useNavigate();

  const [vets, setVets] = useState<Vet[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);

  useEffect(() => {
    // getAllVets/getAllCenters no atrapan el 404 que manda el backend
    // cuando todavía no hay ningún registro, así que lo hacemos aquí y
    // simplemente dejamos la sección vacía en vez de mostrar un error.
    getAllVets()
      .then((data) => setVets(Array.isArray(data) ? data : []))
      .catch(() => setVets([]));

    getAllCenters()
      .then((data) => setCenters(Array.isArray(data) ? data : []))
      .catch(() => setCenters([]));
  }, []);

  return (
    <AuthenticatedLayout>
      <main className="p-8 pb-24 flex flex-col gap-10">
        {/* Botón de solicitar cita, siempre primero */}
        <button
          type="button"
          onClick={() => navigate("/appointments/new")}
          className="
            btn
            w-full
            h-16
            text-lg
            bg-green-800
            hover:bg-green-900
            border-none
            text-white
            rounded-2xl
          "
        >
          Solicitar cita
        </button>

        <CarouselSection
          title="Veterinarios registrados"
          isEmpty={vets.length === 0}
          emptyMessage="Todavía no se han registrado veterinarios."
        >
          {vets.map((vet) => (
            <ProfileIconCard
              key={vet.id}
              to={`/vet-profile/${vet.id}`}
              name={vet.name}
              imageUrl={vet.image_url}
            />
          ))}
        </CarouselSection>

        <CarouselSection
          title="Clínicas registradas"
          isEmpty={centers.length === 0}
          emptyMessage="Todavía no se han registrado clínicas."
        >
          {centers.map((center) => (
            <ProfileIconCard
              key={center.id}
              to={`/clinic-profile/${center.id}`}
              name={center.name}
              imageUrl={center.image_url}
            />
          ))}
        </CarouselSection>
      </main>
    </AuthenticatedLayout>
  );
}