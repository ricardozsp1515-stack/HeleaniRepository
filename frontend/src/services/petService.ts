import {apiFetch} from "./api";


export function getPets(){

 return apiFetch("/pets");

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