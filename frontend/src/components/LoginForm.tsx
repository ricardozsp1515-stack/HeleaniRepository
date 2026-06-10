import { Link } from "react-router-dom";
import RegisterInput from "./RegisterInput";

export default function LoginForm() {
    return (
        <main className="px-10 pt-28">
            <h1 className="text-center text-5xl font-bold text-gray-700">
                ¡Bienvenido!
            </h1>

            <p className="text-center text-gray-600 mt-10">
                ¿Nuevo en la aplicación? Regístrese{" "}
                <Link
                    to="/register"
                    className="text-green-800! font-semibold underline"
                >
                    aquí.
                </Link>
            </p>

            <form className="mt-10 flex flex-col gap-4">
                <RegisterInput
                    type="email"
                    placeholder="Correo electrónico..."
                />

                <RegisterInput
                    type="password"
                    placeholder="Contraseña..."
                />

                <label className="flex items-center gap-3 mt-2">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-success checkbox-sm rounded-none"
                    />

                    <span className="text-sm text-gray-700">
                        Estoy de acuerdo con los{" "}
                        <a
                            href="#"
                            className="text-green-800! font-semibold"
                        >
                            Términos y Condiciones.
                        </a>
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
                    Iniciar sesión
                </button>
            </form>
        </main>
    );
}