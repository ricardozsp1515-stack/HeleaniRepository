import {apiFetch} from "./api";


export async function getPets(){

  try {

    const data = await apiFetch("/pets");

    return data.pets ?? [];

  } catch (error) {

    // El backend responde 404 con "No pets registered" cuando el usuario
    // todavia no tiene mascotas (por ejemplo, recien creado su cuenta).
    // En ese caso mostramos la galeria vacia en vez de un error.
    return [];

  }

}



// Lista de especies disponibles (id + nombre) para el selector del
// formulario de "Agregar mascota"
export function getPetTypes(){

  return apiFetch("/pet-types");

}



// Trae los datos completos de una mascota especifica (incluye datos del
// dueño) para mostrarlos en su perfil
export function getPetById(id: string){

  return apiFetch(`/pets/pet/${id}`);

}



export function createPet(data:any){

 return apiFetch(
   "/pets",
   {
    method:"POST",
    body:JSON.stringify(data)
   }
 );

}