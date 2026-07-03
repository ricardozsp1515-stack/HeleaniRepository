import { useEffect, useState } from "react";

import AuthLayout from "../components/layout/AuthLayout";
import AppointmentRequestCard from "../components/cards/AppointmentRequestCard";

import { getPetById } from "../services/petService";
import {
  getVetPendingAppointments,
  completeAppointment,
} from "../services/appointmentService";

interface AppointmentRow {
  id: string;
  pet_id: string;
  date: string;
}

interface EnrichedAppointment {
  id: string;
  date: string;
  petName: string;
  petImageUrl: string;
  ownerName: string;
}

export default function VetAppointments() {
  const [appointments, setAppointments] = useState<EnrichedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  // Trae las citas pendientes del veterinario y, para cada una, los datos
  // de la mascota (nombre, foto y dueño) que get_pet_by_id ya trae en un
  // solo llamado, para no tener que hacer una segunda consulta por dueño.
  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const rows: AppointmentRow[] = await getVetPendingAppointments();

      const enriched = await Promise.all(
        rows.map(async (row) => {
          try {
            const pet = await getPetById(row.pet_id);

            return {
              id: row.id,
              date: row.date,
              petName: pet.name,
              petImageUrl: pet.image_url,
              ownerName: pet.owner_name,
            };
          } catch {
            // Si por alguna razón la mascota ya no se puede consultar,
            // igual mostramos la cita con datos genéricos en vez de
            // que desaparezca silenciosamente
            return {
              id: row.id,
              date: row.date,
              petName: "Mascota",
              petImageUrl: "",
              ownerName: "Desconocido",
            };
          }
        })
      );

      setAppointments(enriched);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (appointmentId: string, diagnosis: string) => {
    await completeAppointment(appointmentId, diagnosis);

    // Una vez completada, deja de ser "pendiente": se quita de la lista
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  return (
    <AuthLayout>
      <main className="p-8 pb-24 flex flex-col gap-6">
        <h1 className="text-center text-3xl font-bold text-gray-700">
          Citas pendientes
        </h1>

        {loading && (
          <p className="text-center text-gray-600">Cargando...</p>
        )}

        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && appointments.length === 0 && (
          <div className="bg-white rounded-3xl p-6">
            <p className="text-center text-gray-500">
              No tienes citas pendientes por revisar.
            </p>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="flex flex-col gap-4">
            {appointments.map((appointment) => (
              <AppointmentRequestCard
                key={appointment.id}
                petName={appointment.petName}
                petImageUrl={appointment.petImageUrl}
                ownerName={appointment.ownerName}
                date={appointment.date}
                onComplete={(diagnosis) =>
                  handleComplete(appointment.id, diagnosis)
                }
              />
            ))}
          </div>
        )}
      </main>
    </AuthLayout>
  );
}