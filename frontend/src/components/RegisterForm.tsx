import RegisterInput from "./RegisterInput";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  return (
    <main className="px-10 pt-28">
      <h1 className="text-center text-5xl font-bold text-gray-700">
        ¡Bienvenido!
      </h1>

      <p className="text-center text-gray-600 mt-10">
        ¿Ya tiene una cuenta? Inicie sesión{" "}
        <Link to="/login" className="text-green-800! font-semibold underline">
          aquí.
        </Link>
      </p>

      <form className="mt-10 flex flex-col gap-4">
        <RegisterInput placeholder="Nombre completo..." />

        <RegisterInput type="email" placeholder="Correo electrónico..." />

        <RegisterInput type="password" placeholder="Contraseña..." />

        <label className="flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            className="checkbox checkbox-success checkbox-sm rounded-none"
          />

          <span className="text-sm text-gray-700">
            Estoy de acuerdo con los{" "}
            <Link to="/terms" className="text-green-800! font-semibold">
              Términos y Condiciones.
            </Link>
          </span>
        </label>

        <button
          type="submit"
          className="
                        btn
                        bg-green-800
                        hover:bg-green-900
                        border-none
                        text-white
                        mt-6
                        rounded-xl
                    "
        >
          Registrarme
        </button>
      </form>
    </main>
  );
}
