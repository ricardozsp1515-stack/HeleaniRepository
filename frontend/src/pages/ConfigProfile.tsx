import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import BackButton from "../components/buttons/BackButton";
import RegisterInput from "../components/forms/RegisterInput";
import { getProfile, updateProfile } from "../services/userServices";

export default function ConfigureProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Precargamos el formulario con los datos actuales del usuario (nombre y
  // correo). La contraseña nunca se trae del backend, por eso el campo
  // empieza vacio: si se deja asi, no se cambia.
  useEffect(() => {
    getProfile()
      .then((profile) => {
        setName(profile.name ?? "");
        setEmail(profile.email ?? "");
      })
      .catch((err) => setLoadError(err.message || "No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setSaveError("");

    try {
      // Si el campo de contraseña se dejo vacio, no lo mandamos: el
      // backend deja la contraseña actual intacta cuando no recibe una.
      await updateProfile({
        name,
        email,
        password: password ? password : undefined,
      });

      // Mantenemos sincronizado el nombre/correo guardados en localStorage
      // (usados por getCurrentUser en otras pantallas) con los nuevos datos.
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...parsed, username: name, email })
        );
      }

      // Regresamos al perfil para que se vean los cambios ya actualizados
      navigate("/profile");
    } catch (err: any) {
      setSaveError(err.message || "No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout>
      <main className="px-10 pt-10 pb-24 flex flex-col gap-6">
        <BackButton />

        <h1 className="text-center text-4xl font-bold text-gray-700">
          Configurar perfil
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : loadError ? (
          <p className="text-red-600 text-center">{loadError}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <RegisterInput
              placeholder="Nombre..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <RegisterInput
              type="email"
              placeholder="Correo electrónico..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <RegisterInput
              type="password"
              placeholder="Nueva contraseña (opcional)..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {saveError && (
              <p className="text-red-600 text-center">{saveError}</p>
            )}

            <button
              type="submit"
              disabled={saving}
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
              {saving ? "Guardando..." : "Aceptar"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="
                btn
                btn-ghost
                text-gray-600
                rounded-xl
              "
            >
              Cancelar
            </button>
          </form>
        )}
      </main>
    </AuthLayout>
  );
}