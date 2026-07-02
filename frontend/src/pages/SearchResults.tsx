import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import SearchResultCard from "../components/cards/SearchResultCard";
import { globalSearch } from "../services/searchService";

interface SearchResult {
  id: string;
  name: string;
  image_url: string;
  type: "user" | "pet" | "veterinarian" | "veterinary_center";
}

// A donde debe llevar cada tipo de resultado al hacerle click, y como se
// etiqueta en la card (para que el usuario sepa que esta viendo)
const RESULT_CONFIG: Record<
  SearchResult["type"],
  { path: (id: string) => string; label: string }
> = {
  user: { path: (id) => `/user-profile/${id}`, label: "Usuario" },
  pet: { path: (id) => `/pet-profile/${id}`, label: "Mascota" },
  veterinarian: { path: (id) => `/vet-profile/${id}`, label: "Veterinario" },
  veterinary_center: {
    path: (id) => `/clinic-profile/${id}`,
    label: "Clínica",
  },
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    globalSearch(query).then((data) => {
      setResults(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [query]);

  return (
    <AuthLayout>
      <main className="p-8 pb-24 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-700 text-center">
          Resultados para "{query}"
        </h1>

        {loading && (
          <p className="text-center text-gray-600">Buscando...</p>
        )}

        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500">
            No se encontraron resultados.
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map((result) => {
              const config = RESULT_CONFIG[result.type];

              return (
                <Link key={`${result.type}-${result.id}`} to={config.path(result.id)}>
                  <SearchResultCard
                    name={result.name}
                    imageUrl={result.image_url}
                    typeLabel={config.label}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </AuthLayout>
  );
}