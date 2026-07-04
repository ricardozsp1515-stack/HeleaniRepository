import { Link } from "react-router-dom";
import logoWhite from "../../assets/healani-logo-white.svg";

export default function Header() {
  return (
    <header className="bg-green-800 h-20 px-4 flex items-center">
      {/* Este header se usa en Landing/Login/Register, sin sesión iniciada
      todavía, así que el logo lleva a la landing page ("/") en vez de a
      /home (que requiere estar logueado). */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logoWhite} alt="Healani" className="h-10" />

        <div className="text-white">
          <h1 className="font-semibold text-lg">Healani</h1>

          <p className="text-[10px]">Animal Health</p>
        </div>
      </Link>
    </header>
  );
}