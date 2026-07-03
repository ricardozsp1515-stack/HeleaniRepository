import { useRef } from "react";
import type { ReactNode } from "react";

interface CarouselSectionProps {
  title: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

// Carrusel horizontal genérico usado en la página principal para mostrar
// veterinarios y clínicas (y cualquier otra sección similar en el futuro).
// No usa ninguna librería externa: el desplazamiento se hace con scroll
// nativo + scroll-snap, y las flechas simplemente llaman a scrollBy sobre
// el contenedor.
export default function CarouselSection({
  title,
  isEmpty,
  emptyMessage,
  children,
}: CarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    // Se mueve un poco menos que el ancho visible, para que siempre quede
    // algo del siguiente ícono asomando como pista visual
    const amount = container.clientWidth * 0.8;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>

      {isEmpty ? (
        <div className="bg-white rounded-3xl p-6">
          <p className="text-center text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="relative flex items-center">
          {/* Flecha izquierda */}
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            aria-label={`Desplazar ${title} a la izquierda`}
            className="
              btn
              btn-circle
              btn-sm
              bg-white
              border-green-200
              shadow-sm
              shrink-0
              mr-1
              z-10
            "
          >
            ‹
          </button>

          {/* Contenedor con scroll-snap, sin barra de scroll visible */}
          <div
            ref={scrollRef}
            className="
              flex
              gap-4
              overflow-x-auto
              scroll-smooth
              snap-x
              snap-mandatory
              py-2
              px-1
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {children}
          </div>

          {/* Flecha derecha */}
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label={`Desplazar ${title} a la derecha`}
            className="
              btn
              btn-circle
              btn-sm
              bg-white
              border-green-200
              shadow-sm
              shrink-0
              ml-1
              z-10
            "
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}