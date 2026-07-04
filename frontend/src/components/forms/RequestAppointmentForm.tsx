import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import RegisterInput from "./RegisterInput";

import { getPets } from "../../services/petService";
import { getAllVets } from "../../services/vetService";
import { createAppointment } from "../../services/appointmentService";

interface Pet {
  id: string;
  name: string;
}

interface Vet {
  id: string;
  name: string;
  specialty: string;
}

export default function RequestAppointmentForm() {
  const navigate = useNavigate();

  // Si se llega desde el perfil de un veterinario (botón "Solicitar cita"
  // en VetProfile.tsx), la URL trae ?vet=<id> y lo usamos para
  // preseleccionar ese veterinario en el selector de abajo.
  const [searchParams] = useSearchParams();
  const preselectedVetId = searchParams.get("vet") ?? "";

  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);

  const [petId, setPetId] = useState("");
  const [veterinarianId, setVeterinarianId] = useState(preselectedVetId);
  const [date, setDate] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cargamos, en paralelo, las mascotas del usuario (para el selector de
  // "para cuál mascota") y todos los veterinarios registrados (para el
  // selector de "con cuál veterinario")
  useEffect(() => {
    Promise.all([getPets(), getAllVets().catch(() => [])]).then(
      ([petsData, vetsData]) => {
        setPets(Array.isArray(petsData) ? petsData : []);
        setVets(Array.isArray(vetsData) ? vetsData : []);
        setLoading(false);
      }
    );
  }, []);

  // Si el veterinario preseleccionado viene en la URL pero el selector
  // todavía no tiene valor (por ejemplo, si el componente se remonta), lo
  // volvemos a aplicar apenas ya tenemos la lista de veterinarios cargada.
  useEffect(() => {
    if (preselectedVetId && !veterinarianId) {
      setVeterinarianId(preselectedVetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedVetId, vets]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!petId) {
      setError("Selecciona una mascota.");
      return;
    }

    if (!veterinarianId) {
      setError("Selecciona un veterinario.");
      return;
    }

    if (!date) {
      setError("Selecciona una fecha y hora.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await createAppointment({
        veterinarian_id: veterinarianId,
        pet_id: petId,
        date: new Date(date).toISOString(),
      });

      navigate("/home");
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="px-10 pt-16 pb-24">
        <p className="text-center text-gray-600">Cargando...</p>
      </main>
    );
  }

  // Si el usuario todavía no tiene mascotas registradas, no tiene sentido
  // mostrar el formulario: lo mandamos primero a crear una
  if (pets.length === 0) {
    return (
      <main className="px-10 pt-16 pb-24 flex flex-col gap-6">
        <h1 className="text-center text-3xl font-bold text-gray-700">
          Solicitar cita
        </h1>

        <p className="text-center text-gray-600">
          Todavía no tienes mascotas registradas. Agrega una primero para
          poder solicitar una cita.
        </p>

        <Link
          to="/add-pet"
          className="
            btn
            bg-green-800
            hover:bg-green-900
            border-none
            text-white!
            rounded-xl
          "
        >
          Agregar mascota
        </Link>
      </main>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-10 pt-16 pb-24 flex flex-col gap-6"
    >
      <h1 className="text-center text-3xl font-bold text-gray-700">
        Solicitar cita
      </h1>

      <select
        value={petId}
        onChange={(e) => setPetId(e.target.value)}
        className="
          select
          w-full
          bg-white
          border-[#79C798]
          focus:outline-none
          focus:border-green-600
        "
      >
        <option value="">Mascota...</option>
        {pets.map((pet) => (
          <option key={pet.id} value={pet.id}>
            {pet.name}
          </option>
        ))}
      </select>

      <select
        value={veterinarianId}
        onChange={(e) => setVeterinarianId(e.target.value)}
        className="
          select
          w-full
          bg-white
          border-[#79C798]
          focus:outline-none
          focus:border-green-600
        "
      >
        <option value="">Veterinario...</option>
        {vets.map((vet) => (
          <option key={vet.id} value={vet.id}>
            {vet.name} — {vet.specialty}
          </option>
        ))}
      </select>

      <RegisterInput
        type="datetime-local"
        placeholder="Fecha y hora..."
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="
          btn
          bg-green-800
          hover:bg-green-900
          border-none
          text-white!
          rounded-xl
          mt-4
          disabled:opacity-60
        "
      >
        {submitting ? "Solicitando..." : "Solicitar cita"}
      </button>
    </form>
  );
}