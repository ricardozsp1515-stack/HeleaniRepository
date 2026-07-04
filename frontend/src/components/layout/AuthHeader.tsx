import { Link } from "react-router-dom";
import logoWhite from "../../assets/healani-logo-white.svg";
import SearchBar from "../forms/SearchBar";

export default function AuthHeader() {
  return (
    <header className="bg-green-800 px-4 py-3 flex flex-col gap-3">

      {/* Fila superior */}
      <div className="flex items-center justify-between">

        <Link to="/home" className="flex items-center gap-2">

          <img
            src={logoWhite}
            alt="Healani"
            className="h-10"
          />

          <div className="text-white">

            <h1 className="font-semibold text-lg">
              Healani
            </h1>

            <p className="text-[10px]">
              Animal Health
            </p>

          </div>

        </Link>

        <label
          htmlFor="side-menu"
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>

      </div>

      {/* Barra de búsqueda */}
      <SearchBar />

    </header>
  );
}