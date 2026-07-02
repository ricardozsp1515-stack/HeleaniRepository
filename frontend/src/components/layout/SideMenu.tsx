import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, deleteAccount } from "../../services/userServices";
import { getMyVetProfile } from "../../services/vetService";
import { getMyCenters } from "../../services/centerService";
import { logout } from "../../services/authService";

export default function SideMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isVet, setIsVet] = useState(false);
    const [myVetId, setMyVetId] = useState<string | null>(null);
    const [myCentersCount, setMyCentersCount] = useState(0);

    // Controla el modal de confirmación para eliminar el perfil por completo
    const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [deleteAccountError, setDeleteAccountError] = useState("");

    // Verificamos el rol para el panel de admin y el switch de veterinario.
    // Esto es solo UX: el backend igual protege todo lo relevante sin
    // importar lo que muestre el menu.
    useEffect(() => {
        getProfile()
            .then((profile) => {
                setIsAdmin(profile.role_name === "admin");
                setIsVet(profile.role_name === "Veterinarian");
            })
            .catch(() => {
                setIsAdmin(false);
                setIsVet(false);
            });
    }, []);

    // Si el usuario es veterinario, buscamos su propio veterinarian.id una
    // sola vez, para no tener que pedirlo cada vez que se hace click
    useEffect(() => {
        if (!isVet) return;

        getMyVetProfile().then((myVet) => {
            setMyVetId(myVet?.id ?? null);
        });
    }, [isVet]);

    // Cualquier usuario (no solo veterinarios) puede llegar a ser dueño de
    // una o varias clinicas una vez el admin aprueba su(s) solicitud(es),
    // asi que esto se busca sin importar el rol
    useEffect(() => {
        getMyCenters().then((centers) => {
            setMyCentersCount(Array.isArray(centers) ? centers.length : 0);
        });
    }, []);

    // "Modo veterinario" no es un estado global, se define por la ruta en la
    // que estas: si ya estas viendo tu propio perfil de veterinario, el boton
    // cambia a "Volver a modo usuario"
    const inVetMode = myVetId !== null && location.pathname === `/vet-profile/${myVetId}`;

    const handleToggleVetMode = () => {
        if (inVetMode) {
            navigate("/profile");
        } else if (myVetId) {
            navigate(`/vet-profile/${myVetId}`);
        }
    };

    // Elimina la cuenta por completo (mascotas, citas, comentarios, perfil
    // de veterinario y clinicas propias caen en cascada en el backend), y
    // luego cierra la sesion como si el usuario hubiera hecho logout normal.
    const handleDeleteAccount = async () => {
        setDeletingAccount(true);
        setDeleteAccountError("");

        try {
            await deleteAccount();

            logout();
            navigate("/");
        } catch (err: any) {
            setDeleteAccountError(err.message || "No se pudo eliminar el perfil");
            setDeletingAccount(false);
        }
    };

  return (
    <div className="drawer-side z-50">
      <label htmlFor="side-menu" className="drawer-overlay"></label>

      <ul className="menu p-6 w-64 min-h-full bg-green-700 text-white">
        {/* General */}
        <h2 className="text-4xl mb-4">General</h2>

        <li>
          <Link to="/configure-profile" className="text-white! text-2xl">
            Configurar perfil
          </Link>
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

        {/* Modo veterinario - solo visible si el usuario ya es veterinario */}
        {isVet && myVetId && (
          <>
            <li>
              <button
                type="button"
                onClick={handleToggleVetMode}
                className="text-white! text-2xl w-full text-left"
              >
                {inVetMode ? "Volver a modo usuario" : "Cambiar a modo veterinario"}
              </button>
            </li>

            <div className="divider divider-neutral"></div>
          </>
        )}

        {/* Administrar clínicas - visible solo si el usuario tiene al menos
        una clinica aprobada. Lleva al listado; desde ahi se entra al perfil
        de cada una para verla/editarla. */}
        {myCentersCount > 0 && (
          <>
            <li>
              <Link to="/manage-clinics" className="text-white! text-2xl">
                Administrar clínicas
              </Link>
            </li>

            <div className="divider divider-neutral"></div>
          </>
        )}

        {/* Afiliaciones */}
        <h2 className="text-4xl mb-4">Afiliaciones</h2>

        <li>
          <Link to="/vet-verification" className="text-white! text-2xl">
            Afiliación veterinaria
          </Link>
        </li>

        <li>
          <Link to="/clinic-verification" className="text-white! text-2xl">
            Afiliación clínica
          </Link>
        </li>

        <div className="divider divider-neutral"></div>

        {/* Administración - solo visible para admins */}
        {isAdmin && (
          <>
            <h2 className="text-4xl mb-4">Administración</h2>

            <li>
              <Link to="/admin" className="text-white! text-2xl">
                Panel de administrador
              </Link>
            </li>

            <div className="divider divider-neutral"></div>
          </>
        )}

        {/* Preferencias */}
        <h2 className="text-4xl mb-4">Preferencias</h2>

        <li>
          <div className="flex justify-between items-center w-full">
            <span className="text-white text-2xl">Notificaciones</span>

            <input
              type="checkbox"
              defaultChecked
              className="toggle toggle-success toggle-sm"
            />
          </div>
        </li>

        <li>
          <Link to="/information" className="text-white! text-2xl">
            Información
          </Link>
        </li>

        <li>
          <button
            type="button"
            onClick={() => {
              // Cierra la sesion por completo: borra el token y los datos
              // del usuario guardados en localStorage, no solo redirige.
              logout();
              navigate("/");
            }}
            className="text-white! text-2xl w-full text-left"
          >
            Cerrar sesión
          </button>
        </li>

        <div className="divider divider-neutral"></div>

        {/* Zona de peligro */}
        <h2 className="text-4xl mb-4">Zona de peligro</h2>

        <li>
          <button
            type="button"
            onClick={() => {
              setShowDeleteAccountConfirm(true);
              setDeleteAccountError("");
            }}
            className="text-2xl w-full text-left"
          >
            Eliminar perfil
          </button>
        </li>
      </ul>

      {/* Modal de confirmación para eliminar el perfil */}
      {showDeleteAccountConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-85 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800">
              ¿Eliminar tu perfil por completo?
            </h3>

            <p className="text-gray-600">
              Esta acción eliminará tu cuenta de forma permanente, junto con
              todas tus mascotas, citas, comentarios, tu perfil de
              veterinario (si lo tienes) y las clínicas de las que seas
              dueño. No se puede deshacer.
            </p>

            {deleteAccountError && (
              <p className="text-red-600 text-center">{deleteAccountError}</p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => setShowDeleteAccountConfirm(false)}
                className="btn flex-1 rounded-xl border-gray-300"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={deletingAccount}
                onClick={handleDeleteAccount}
                className="btn flex-1 rounded-xl bg-red-600 hover:bg-red-700 border-none text-white"
              >
                {deletingAccount ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}