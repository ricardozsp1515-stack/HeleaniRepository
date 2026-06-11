import RegisterInput from "./RegisterInput";
import AddItemCard from "../cards/AddItemCard";
import UploadArea from "../layout/UploadArea";
import { Link } from "react-router-dom";

export default function AddPetForm() {
  return (
    <main className="px-10 pt-16 pb-24 flex flex-col gap-6">

      <h1 className="text-center text-3xl font-bold text-gray-700">
        Agregar mascota
      </h1>

      <UploadArea
        text="Subir imagen."
        successMessage="¡Subida exitosamente!"
      />

      <RegisterInput placeholder="Nombre..." />
      <RegisterInput placeholder="Especie..." />
      <RegisterInput placeholder="Raza..." />
      <RegisterInput placeholder="Sexo..." />
      <RegisterInput placeholder="Edad..." />
      <RegisterInput placeholder="Peso..." />
      <RegisterInput placeholder="Color..." />


      <h2 className="text-center text-3xl font-bold text-gray-700">
        Exámenes médicos
      </h2>

      <UploadArea
        text=""
        successMessage="¡Subido exitosamente!"
        height="h-24"
      />

      <div>
        <AddItemCard
          title="Condiciones especiales"
          placeholder="Agregar..."
        />
      </div>

      <div>
        <AddItemCard
          title="Registro de veterinarios y clínicas"
          placeholder="Agregar..."
        />
      </div>

      <Link
        to="/profile"
        className="
          btn
          bg-green-800
          hover:bg-green-900
          border-none
          text-white!
          rounded-xl
          mt-4
        "
      >
        Agregar mascota
      </Link>

    </main>
  );
}