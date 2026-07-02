import { apiFetch } from "./api";


// Trae los datos del usuario autenticado (nombre, correo, imagen de perfil, rol)
// usando el token guardado en localStorage. El backend identifica al usuario
// a partir del token, por eso no se necesita pasar ningun id.
export function getProfile() {

  return apiFetch("/users/get_user");

}


// Trae el perfil publico (solo nombre y foto) de cualquier usuario, sin
// importar quien sea el usuario autenticado que lo consulta. Se usa para
// mostrar el perfil de un usuario al que se llega desde un resultado de
// busqueda, o desde la card de "Dueño(a)" en el perfil de una mascota.
export function getPublicProfile(id: string) {

  return apiFetch(`/users/public/${id}`);

}

// Actualiza los datos del usuario autenticado (nombre, correo y,
// opcionalmente, contraseña). El backend identifica al usuario a partir
// del token, por eso no se necesita pasar ningun id. Si password viene
// undefined, JSON.stringify lo omite del body y el backend simplemente no
// toca la contraseña actual.
export function updateProfile(data: {
  name: string;
  email: string;
  password?: string;
}) {

  return apiFetch("/users", {
    method: "PUT",
    body: JSON.stringify(data),
  });

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