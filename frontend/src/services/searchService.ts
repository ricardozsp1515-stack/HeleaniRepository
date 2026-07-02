import { apiFetch } from "./api";

// Busca, por nombre, entre usuarios, mascotas, veterinarios y clinicas.
// El backend devuelve un arreglo combinado donde cada resultado trae un
// campo "type" ("user" | "pet" | "veterinarian" | "veterinary_center")
// para saber a que perfil dirigir al usuario cuando le de click a la card.
export async function globalSearch(query: string) {

  try {

    return await apiFetch(`/search?q=${encodeURIComponent(query)}`);

  } catch (error) {

    // El backend responde 404 con "No results found" cuando ningun
    // usuario, mascota, veterinario o clinica coincide con la busqueda.
    return [];

  }

}