interface AppointmentCardProps {
  vetName: string;
  date: string;
  status: string;
  diagnosis: string | null;
  onCancel?: () => void;
  canceling?: boolean;
}

// Card de una cita dentro de la sección "Citas" del perfil de una mascota.
// Muestra el estado con un badge y, si ya fue completada, el diagnóstico.
// El botón de cancelar solo se pasa (onCancel) cuando la cita está
// pendiente y quien ve la página es el dueño de la mascota.
export default function AppointmentCard({
  vetName,
  date,
  status,
  diagnosis,
  onCancel,
  canceling,
}: AppointmentCardProps) {
  const formattedDate = new Date(date).toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isPending = status === "pending";

  return (
    <div className="border border-green-400 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-gray-700">
            Veterinario: {vetName}
          </h3>

          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>

        <span
          className={`
            text-xs
            font-semibold
            px-2
            py-1
            rounded-full
            shrink-0
            ${
              isPending
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }
          `}
        >
          {isPending ? "Pendiente" : "Completada"}
        </span>
      </div>

      {diagnosis && (
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Diagnóstico: </span>
          {diagnosis}
        </p>
      )}

      {isPending && onCancel && (
        <button
          type="button"
          disabled={canceling}
          onClick={onCancel}
          className="
            btn
            btn-outline
            btn-sm
            border-red-600
            text-red-600
            disabled:opacity-60
            self-start
          "
        >
          {canceling ? "Cancelando..." : "Cancelar cita"}
        </button>
      )}
    </div>
  );
}