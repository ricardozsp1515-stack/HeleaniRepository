import { apiFetch } from "./api";


// Trae los datos del usuario autenticado (nombre, correo, imagen de perfil, rol)
// usando el token guardado en localStorage. El backend identifica al usuario
// a partir del token, por eso no se necesita pasar ningun id.
export function getProfile() {

  return apiFetch("/users/get_user");

}


// Elimina por completo la cuenta del usuario autenticado: mascotas, citas,
// comentarios, su perfil de veterinario (si lo tiene) y las clinicas de las
// que sea dueño. El backend identifica al usuario a partir del token, por
// eso no se necesita pasar ningun id. Esta accion es irreversible.
export function deleteAccount() {

  return apiFetch("/users", {
    method: "DELETE",
  });

}