interface StarRatingProps {

  value: number;

  onChange?: (stars: number) => void;

  readOnly?: boolean;

  size?: "sm" | "md";

}



// Componente de doble uso:

// - Modo selector (readOnly=false, con onChange): usado en CommentForm

//   para que el usuario elija de 1 a 5 estrellas.

// - Modo display (readOnly=true, sin onChange): usado en CommentCard y en

//   el promedio de CommentsSection para mostrar una calificacion ya fija.

export default function StarRating({

  value,

  onChange,

  readOnly = false,

  size = "md",

}: StarRatingProps) {

  const starSizeClass = size === "sm" ? "text-lg" : "text-2xl";



  const stars = [1, 2, 3, 4, 5];



  return (

    <div

      className="flex gap-1"

      role={readOnly ? "img" : "radiogroup"}

      aria-label={`Calificacion: ${value} de 5 estrellas`}

    >

      {stars.map((starNumber) => {

        const isFilled = starNumber <= value;



        // En modo solo lectura, cada estrella es un simple span: no hace

        // falta que sea interactiva ni foco-navegable.

        if (readOnly) {

          return (

            <span

              key={starNumber}

              className={`${starSizeClass} ${

                isFilled ? "text-yellow-500" : "text-gray-300"

              }`}

            >

              ★

            </span>

          );

        }



        // En modo selector, cada estrella es un boton para poder elegir

        // la calificacion con click (o con teclado, al ser un <button>).

        return (

          <button

            key={starNumber}

            type="button"

            onClick={() => onChange?.(starNumber)}

            aria-label={`${starNumber} estrella${starNumber > 1 ? "s" : ""}`}

            className={`${starSizeClass} ${

              isFilled ? "text-yellow-500" : "text-gray-300"

            } hover:text-yellow-400 transition-colors`}

          >

            ★

          </button>

        );

      })}

    </div>

  );

}