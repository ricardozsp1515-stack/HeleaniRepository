import { useState } from "react";

import StarRating from "./StarRating";

import { createComment, updateComment } from "../../services/commentService";



interface CommentFormProps {

  mode: "create" | "edit";



  // Requeridos en modo "create": a quien va dirigida la reseña nueva.

  targetType?: "veterinarian" | "veterinary_center";

  targetId?: string;



  // Requerido en modo "edit": que reseña se esta editando.

  commentId?: string;



  // Valores iniciales, usados en modo "edit" para precargar el formulario.

  initialStars?: number;

  initialComment?: string;



  // Se llama despues de crear/editar con exito, para que CommentsSection

  // vuelva a pedir la lista de reseñas y cierre el formulario.

  onSuccess: () => void;



  // Se llama al presionar "Cancelar" (solo tiene sentido en modo "edit",

  // o si se quiere permitir cerrar el formulario de creacion sin enviar).

  onCancel?: () => void;

}



// Sigue el mismo patrón que AddPetForm / RequestAppointmentForm: el

// formulario es dueño de su propio estado y llama directo al servicio, en

// vez de recibir un onSubmit genérico desde el padre.

export default function CommentForm({

  mode,

  targetType,

  targetId,

  commentId,

  initialStars = 0,

  initialComment = "",

  onSuccess,

  onCancel,

}: CommentFormProps) {

  const [stars, setStars] = useState(initialStars);

  const [comment, setComment] = useState(initialComment);



  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();



    // Misma validacion que exige el backend (create_comment_schema /

    // update_comment_schema con Zod), repetida aca para dar feedback

    // inmediato sin esperar la respuesta del servidor.

    if (stars < 1 || stars > 5) {

      setError("Selecciona una calificación de 1 a 5 estrellas.");

      return;

    }



    if (!comment.trim()) {

      setError("Escribe un comentario antes de enviar.");

      return;

    }



    setError("");

    setSubmitting(true);



    try {

      if (mode === "create") {

        await createComment({

          veterinarian_id:

            targetType === "veterinarian" ? targetId : undefined,

          veterinary_center_id:

            targetType === "veterinary_center" ? targetId : undefined,

          stars,

          comment: comment.trim(),

        });

      } else {

        if (!commentId) {

          throw new Error("Falta el id de la reseña a editar.");

        }



        await updateComment(commentId, {

          stars,

          comment: comment.trim(),

        });

      }



      onSuccess();

    } catch (err: any) {

      setError(err.message || "No se pudo guardar la reseña.");

      setSubmitting(false);

    }

  };



  return (

    <form

      onSubmit={handleSubmit}

      className="border border-green-400 rounded-xl p-3 flex flex-col gap-3"

    >

      <div className="flex flex-col gap-1">

        <span className="text-sm font-semibold text-gray-700">

          Tu calificación

        </span>



        <StarRating value={stars} onChange={setStars} />

      </div>



      <textarea

        value={comment}

        onChange={(e) => setComment(e.target.value)}

        placeholder="Comparte tu experiencia..."

        rows={3}

        className="

          textarea

          w-full

          bg-transparent

          border-[#79C798]

          focus:outline-none

          focus:border-green-600

        "

      />



      {error && <p className="text-red-600 text-sm">{error}</p>}



      <div className="flex gap-2">

        <button

          type="submit"

          disabled={submitting}

          className="

            btn

            btn-sm

            bg-green-800

            hover:bg-green-900

            border-none

            text-white!

            rounded-xl

            disabled:opacity-60

          "

        >

          {submitting

            ? "Guardando..."

            : mode === "create"

            ? "Publicar reseña"

            : "Guardar cambios"}

        </button>



        {onCancel && (

          <button

            type="button"

            disabled={submitting}

            onClick={onCancel}

            className="

              btn

              btn-sm

              btn-outline

              border-gray-300

              text-gray-600

              rounded-xl

              disabled:opacity-60

            "

          >

            Cancelar

          </button>

        )}

      </div>

    </form>

  );

}