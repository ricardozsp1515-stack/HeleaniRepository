import StarRating from "../forms/StarRating";



interface CommentCardProps {

  authorName: string;

  authorImageUrl?: string;

  stars: number;

  comment: string;

  createdAt: string;

  canManage: boolean;

  onEdit?: () => void;

  onDelete?: () => void;

  deleting?: boolean;

}



// Card de una reseña dentro de la sección "Reseñas" del perfil de un

// veterinario o de una clínica. Sigue el mismo patrón que AppointmentCard

// y OwnerCard: solo recibe props, no llama a la API. CommentsSection es

// quien decide, comparando el user_id de la reseña con el usuario

// logueado (o si es admin), si pasa onEdit/onDelete o los deja undefined.

export default function CommentCard({

  authorName,

  authorImageUrl,

  stars,

  comment,

  createdAt,

  canManage,

  onEdit,

  onDelete,

  deleting,

}: CommentCardProps) {

  const formattedDate = new Date(createdAt).toLocaleDateString("es-ES", {

    day: "numeric",

    month: "long",

    year: "numeric",

  });



  return (

    <div className="border border-green-400 rounded-xl p-3 flex flex-col gap-2">

      <div className="flex justify-between items-start gap-2">

        <div className="flex gap-3 items-center">

          <div className="avatar">

            <div className="w-10 rounded-full">

              <img

                src={authorImageUrl || "/vite.svg"}

                alt={authorName}

              />

            </div>

          </div>



          <div>

            <h3 className="font-semibold text-gray-700">{authorName}</h3>

            <p className="text-xs text-gray-500">{formattedDate}</p>

          </div>

        </div>



        <StarRating value={stars} readOnly size="sm" />

      </div>



      <p className="text-sm text-gray-600">{comment}</p>



      {canManage && (onEdit || onDelete) && (

        <div className="flex gap-2 mt-1">

          {onEdit && (

            <button

              type="button"

              onClick={onEdit}

              className="

                btn

                btn-outline

                btn-sm

                border-green-700

                text-green-700

              "

            >

              Editar

            </button>

          )}



          {onDelete && (

            <button

              type="button"

              disabled={deleting}

              onClick={onDelete}

              className="

                btn

                btn-outline

                btn-sm

                border-red-600

                text-red-600

                disabled:opacity-60

              "

            >

              {deleting ? "Eliminando..." : "Eliminar"}

            </button>

          )}

        </div>

      )}

    </div>

  );

}