import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import { getPublicProfile } from "../services/userServices";
import { getCurrentUser } from "../services/authService";

interface PublicProfile {
  id: string;
  name: string;
  image_url: string;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getPublicProfile(id)
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message || "No se pudo cargar el perfil"));
  }, [id]);

  // Si el usuario esta viendo su propio perfil (por ejemplo, llego desde un
  // resultado de busqueda), lo mandamos a /profile, que es la version
  // completa y editable con su galeria de mascotas.
  const currentUser = getCurrentUser();
  if (id && currentUser && currentUser.id === id) {
    return <Navigate to="/profile" replace />;
  }

  if (error) {
    return (
      <AuthLayout>
        <main className="p-8">
          <p className="text-center text-red-600">{error}</p>
        </main>
      </AuthLayout>
    );
  }

  if (!profile) {
    return (
      <AuthLayout>
        <main className="p-8">
          <p className="text-center text-gray-600">Cargando...</p>
        </main>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <main className="p-8 pb-24 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <img
            src={profile.image_url}
            alt={profile.name}
            className="w-full h-44 object-cover rounded-2xl"
          />

          <div className="mt-4">
            <h2 className="text-3xl font-semibold text-gray-700">
              {profile.name}
            </h2>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}