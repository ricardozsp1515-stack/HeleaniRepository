import { useRef } from "react";
import type { ReactNode } from "react";

interface CarouselSectionProps {
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

// Carrusel horizontal genérico usado en la página principal para mostrar
// veterinarios y clínicas (y cualquier otra sección similar en el futuro).
// No usa ninguna librería externa: el desplazamiento se hace con scroll
// nativo + scroll-snap, y las flechas simplemente llaman a scrollBy sobre
// el contenedor.
//
// El título y la caja blanca que envuelve la sección los maneja quien use
// este componente (ver Home.tsx): así el título queda dentro de la misma
// caja que el carrusel, en vez de vivir fuera de ella.
export default function CarouselSection({
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

  if (isEmpty) {
    return <p className="text-center text-gray-500 p-2">{emptyMessage}</p>;
  }

  return (
    <div className="relative flex items-center">
      {/* Flecha izquierda */}
      <button
        type="button"
        onClick={() => scrollByAmount("left")}
        aria-label="Desplazar a la izquierda"
        className="
          shrink-0
          mr-1
          z-10
          flex
          items-center
          justify-center
          text-green-700
          hover:text-green-800
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-8"
        >
          <path d="M15 5 L8 12 L15 19" />
        </svg>
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
        aria-label="Desplazar a la derecha"
        className="
          shrink-0
          ml-1
          z-10
          flex
          items-center
          justify-center
          text-green-700
          hover:text-green-800
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-8"
        >
          <path d="M9 5 L16 12 L9 19" />
        </svg>
      </button>
    </div>
  );
}