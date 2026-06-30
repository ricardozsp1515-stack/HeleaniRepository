import { apiFetch } from "./api";


export async function register(data:any){

  return await apiFetch(
    "/auth/register",
    {
      method:"POST",

      body:JSON.stringify(data)
    }
  );

}



export async function login(
  email:string,
  password:string
){

  return await apiFetch(
    "/auth/login",
    {
      method:"POST",

      body:JSON.stringify({
        email,
        password
      })
    }
  );

}