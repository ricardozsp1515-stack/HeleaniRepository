import { Link } from "react-router-dom";

export default function SideMenu() {
  return (
    <div className="drawer-side z-50">
      <label htmlFor="side-menu" className="drawer-overlay"></label>

      <ul className="menu p-6 w-64 min-h-full bg-green-700 text-white">

        {/* General */}
        <h2 className="text-4xl mb-4">
          General
        </h2>

        <li>
          <Link
            to="/configure-profile"
            className="text-white! text-2xl"
          >
            Configurar perfil
          </Link>
        </li>

        <li>
          <Link
            to="/"
            className="text-white! text-2xl"
          >
            Página principal
          </Link>
        </li>

        <li>
          <Link
            to="/terms"
            className="text-white! text-2xl"
          >
            Términos y condiciones
          </Link>
        </li>

        <div className="divider divider-neutral"></div>

        {/* Afiliaciones */}
        <h2 className="text-4xl mb-4">
          Afiliaciones
        </h2>

        <li>
          <Link
            to="/vet-verification"
            className="text-white! text-2xl"
          >
            Afiliación veterinaria
          </Link>
        </li>

        <li>
          <Link
            to="/clinic-verification"
            className="text-white! text-2xl"
          >
            Afiliación clínica
          </Link>
        </li>

        <div className="divider divider-neutral"></div>

        {/* Preferencias */}
        <h2 className="text-4xl mb-4">
          Preferencias
        </h2>

        <li>
          <a className="text-white! text-2xl">
            Notificaciones
          </a>
        </li>

        <li>
          <a className="text-white! text-2xl">
            Información
          </a>
        </li>

        <li>
          <Link
            to="/"
            className="text-white! text-2xl"
          >
            Cerrar sesión
          </Link>
        </li>

      </ul>
    </div>
  );
}