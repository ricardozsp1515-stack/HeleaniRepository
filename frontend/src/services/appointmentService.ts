import { apiFetch } from "./api";


// Crea una nueva cita para una mascota del usuario logueado con un
// veterinario específico. data: { veterinarian_id, pet_id, date }
// date debe ser un string interpretable por `new Date()` (el backend hace
// new Date(date) directamente).
export function createAppointment(data: {
  veterinarian_id: string;
  pet_id: string;
  date: string;
}) {

  return apiFetch("/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });

}


// Trae todas las citas (pendientes y completadas) de una mascota específica,
// para mostrarlas en la sección "Citas" de su perfil. Solo funciona si el
// usuario logueado es el dueño de esa mascota (o admin/veterinario).
export async function getPetAppointments(petId: string) {

  try {

    return await apiFetch(`/appointments/user_pet/${petId}`);

  } catch (error) {

    // El backend responde 404 tanto si la mascota no tiene citas como si
    // no pertenece al usuario logueado; en ambos casos mostramos la
    // sección vacía en vez de un error.
    return [];

  }

}


// Trae las citas pendientes del veterinario logueado (requiere que el
// usuario tenga perfil de veterinario). Se usa en /vet-appointments.
export async function getVetPendingAppointments() {

  try {

    return await apiFetch("/appointments/vet");

  } catch (error) {

    // 404 si el usuario no tiene perfil de veterinario, o simplemente no
    // hay citas pendientes en este momento.
    return [];

  }

}


// Marca una cita como completada y adjunta el diagnóstico. Solo la puede
// usar un veterinario o un admin (lo valida el backend).
export function completeAppointment(id: string, diagnosis: string) {

  return apiFetch(`/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ diagnosis }),
  });

}


// Cancela (borra) una cita. Solo el dueño de la cita puede hacerlo (o un
// admin), lo valida el backend comparando el token con el user_id de la cita.
export function cancelAppointment(id: string) {

  return apiFetch(`/appointments/${id}`, {
    method: "DELETE",
  });

}