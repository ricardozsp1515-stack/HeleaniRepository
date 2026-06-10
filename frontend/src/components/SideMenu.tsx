import { Link } from "react-router-dom";

export default function SideMenu() {
    return (
        <div className="drawer-side z-50">
            <label
                htmlFor="side-menu"
                className="drawer-overlay"
            ></label>

            <ul className="menu p-6 w-64 min-h-full bg-green-700 text-white">

                <h2 className="text-4xl mb-4">
                    General
                </h2>

                <li>
                    <a className="text-white! text-2xl">Configurar perfil</a>
                </li>

                <li>
                    <Link to="/" className="text-white! text-2xl">
                        Página principal
                    </Link>
                </li>

                <li>
                    <Link to="/terms" className="text-white! text-2xl">
                        Términos y condiciones
                    </Link>
                </li>

                <div className="divider divider-neutral"></div>

                <h2 className="text-4xl mb-4">
                    Preferencias
                </h2>

                <li>
                    <a className="text-white! text-2xl">Notificaciones</a>
                </li>

                <li>
                    <a className="text-white! text-2xl">Información</a>
                </li>

                <li>
                    <Link to="/" className="text-white! text-2xl">
                        Cerrar sesión
                    </Link>
                </li>
            </ul>
        </div>
    );
}