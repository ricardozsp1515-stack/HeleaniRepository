import { useState } from "react";

interface AppointmentRequestCardProps {
  petName: string;
  petImageUrl: string;
  ownerName: string;
  date: string;
  onComplete: (diagnosis: string) => Promise<void>;
}

// Card de una cita pendiente en el panel del veterinario. Solo tiene la
// acción de "marcar como completada", que abre un pequeño campo de
// diagnóstico (obligatorio, lo exige el backend) antes de confirmar.
export default function AppointmentRequestCard({
  petName,
  petImageUrl,
  ownerName,
  date,
  onComplete,
}: AppointmentRequestCardProps) {
  const [showDiagnosisInput, setShowDiagnosisInput] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const formattedDate = new Date(date).toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleComplete = async () => {
    if (!diagnosis.trim()) {
      setError("Escribe un diagnóstico antes de completar la cita.");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      await onComplete(diagnosis);
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 flex flex-col gap-3">
      <div className="flex gap-3 items-center">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={petImageUrl} alt={petName} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">{petName}</h3>
          <p className="text-sm text-gray-500">Dueño(a): {ownerName}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600">{formattedDate}</p>

      {showDiagnosisInput ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Diagnóstico..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="
              input
              w-full
              bg-transparent
              border-[#79C798]
              focus:outline-none
              focus:border-green-600
            "
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={processing}
              onClick={handleComplete}
              className="
                btn
                bg-green-700
                hover:bg-green-800
                border-none
                text-white!
                disabled:opacity-60
              "
            >
              Confirmar
            </button>

            <button
              type="button"
              disabled={processing}
              onClick={() => {
                setShowDiagnosisInput(false);
                setError("");
              }}
              className="btn btn-outline border-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowDiagnosisInput(true)}
          className="
            btn
            bg-green-800
            hover:bg-green-900
            border-none
            text-white!
            rounded-xl
          "
        >
          Marcar como completada
        </button>
      )}
    </div>
  );
}