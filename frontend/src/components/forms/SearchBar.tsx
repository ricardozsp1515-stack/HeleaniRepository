import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();

  // Si ya estamos en /search?q=..., precargamos el input con ese termino
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar usuarios, mascotas, veterinarios o clínicas..."
        className="
          input
          input-bordered
          w-full
          bg-white
          text-black
          border-none
          rounded-xl
          pl-10
        "
      />

      <button
        type="submit"
        aria-label="Buscar"
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-gray-500
        "
      >
        🔍
      </button>
    </form>
  );
}