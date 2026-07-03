import { apiFetch } from "./api";


// Trae todas las reseñas de un veterinario especifico, para mostrarlas en
// la seccion "Reseñas" de su perfil. Se usa en VetProfile.tsx.
export async function getVetComments(vetId: string) {

  try {

    return await apiFetch(`/comments/vet/${vetId}`);

  } catch (error) {

    // El backend responde 404 con "No comments registered" cuando el
    // veterinario todavia no tiene reseñas. En ese caso mostramos la
    // seccion vacia (estado "se el primero en dejar una reseña") en vez
    // de un error.
    return [];

  }

}


// Trae todas las reseñas de una clinica especifica, para mostrarlas en la
// seccion "Reseñas" de su perfil. Se usa en ClinicProfile.tsx.
export async function getCenterComments(centerId: string) {

  try {

    return await apiFetch(`/comments/center/${centerId}`);

  } catch (error) {

    // El backend responde 404 con "No comments registered" cuando la
    // clinica todavia no tiene reseñas.
    return [];

  }

}


// Crea una nueva reseña del usuario logueado, dirigida a un veterinario o
// a una clinica (nunca ambos a la vez, el backend lo valida). data:
// { veterinarian_id? | veterinary_center_id?, stars (1-5), comment }
export function createComment(data: {
  veterinarian_id?: string;
  veterinary_center_id?: string;
  stars: number;
  comment: string;
}) {

  return apiFetch("/comments", {
    method: "POST",
    body: JSON.stringify(data),
  });

}


// Actualiza una reseña existente (estrellas y/o texto). Solo el dueño de
// la reseña puede editarla (o un admin, agregando ?user=<id> a la url), lo
// valida el backend comparando el token con el user_id de la reseña.
export function updateComment(
  id: string,
  data: { stars?: number; comment?: string },
  asAdminForUser?: string
) {

  const query = asAdminForUser ? `?user=${asAdminForUser}` : "";

  return apiFetch(`/comments/${id}${query}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

}


// Elimina una reseña. Solo el dueño de la reseña puede borrarla (o un
// admin, agregando ?user=<id> a la url).
export function deleteComment(id: string, asAdminForUser?: string) {

  const query = asAdminForUser ? `?user=${asAdminForUser}` : "";

  return apiFetch(`/comments/${id}${query}`, {
    method: "DELETE",
  });

}