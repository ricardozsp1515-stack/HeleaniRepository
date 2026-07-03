import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import VetCard from "../components/cards/VetCard";
import CommentsSection from "../components/sections/CommentsSection";
import { getCenterById, updateCenter, deleteCenter } from "../services/centerService";
import { getVetsFromCenter } from "../services/vetService";
import { getCurrentUser } from "../services/authService";

interface Center {
  id: string;
  user_id: string;
  owner: string;
  name: string;
  address: string;
  contact: string;
  description: string;
  image_url: string;
}

interface Vet {
  id: string;
  name: string;
  image_url: string;
}

export default function ClinicProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [center, setCenter] = useState<Center | null>(null);
  const [vets, setVets] = useState<Vet[]>([]);

  // Controla el modo edicion de la informacion basica
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loadError, setLoadError] = useState("");

  // Controla el flujo de eliminar la clinica: primero se pide confirmacion,
  // solo se elimina de verdad si el dueño confirma explicitamente
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadCenter = () => {
    if (!id) return;

    getCenterById(id)
      .then((data) => setCenter(data))
      .catch((err) => setLoadError(err.message));
  };

  useEffect(() => {
    loadCenter();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    getVetsFromCenter(id)
      .then((data) => setVets(data))
      .catch(() => setVets([]));
  }, [id]);

  // El lapiz de editar solo aparece si el usuario logueado es el dueño de
  // la clinica. Esto es solo UX: el backend valida lo mismo comparando el
  // token contra veterinary_center.user_id en update_center.
  const currentUser = getCurrentUser();
  const isOwner = center && currentUser && currentUser.id === center.user_id;

  const handleEditClick = () => {
    if (!center) return;

    // Precargamos los campos editables con los datos actuales de la clinica
    setEditName(center.name);
    setEditAddress(center.address);
    setEditContact(center.contact);
    setEditDescription(center.description);

    setSaveError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError("");
    // si el dueño estaba a mitad de confirmar el borrado y cancela la
    // edicion, tambien cerramos la confirmacion para no dejarla colgada
    setShowDeleteConfirm(false);
    setDeleteError("");
  };

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    setSaveError("");

    try {
      await updateCenter(id, {
        name: editName,
        address: editAddress,
        contact: editContact,
        description: editDescription,
      });

      loadCenter();
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err.message || "No se pudo guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClinic = async () => {
    if (!id) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteCenter(id);

      // La clinica ya no existe: no tiene sentido dejar al usuario en esta
      // pagina, lo mandamos a la lista de clinicas que administra
      navigate("/manage-clinics");
    } catch (err: any) {
      setDeleteError(err.message || "No se pudo eliminar la clínica");
      setDeleting(false);
    }
  };

  if (loadError) {
    return (
      <AuthLayout>
        <main className="p-8">
          <p className="text-center text-red-600">{loadError}</p>
        </main>
      </AuthLayout>
    );
  }

  if (!center) {
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
        {/* Header */}
        <div className="card border border-green-400 bg-white">
          <div className="card-body p-3">
            <img
              src={center.image_url}
              alt={center.name}
              className="rounded-xl h-56 object-cover"
            />

            <div className="flex justify-between items-center mt-3">
              <div className="flex-1 mr-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nombre..."
                    className="
                      input
                      w-full
                      font-bold
                      text-2xl
                      text-gray-700
                      bg-transparent
                      border-[#79C798]
                      focus:outline-none
                      focus:border-green-600
                    "
                  />
                ) : (
                  <h1 className="font-bold text-4xl text-gray-700">
                    {center.name}
                  </h1>
                )}
              </div>

              {isOwner && !isEditing && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  aria-label="Editar clínica"
                  className="btn btn-ghost text-green-800 text-2xl"
                >
                  ✎
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-6">
          <section>
            <h2 className="text-3xl font-bold text-gray-700">
              Clínica afiliada
            </h2>

            <p className="text-gray-600 mt-2">
              Dueño: {center.owner}
            </p>
          </section>

          {isEditing ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Dirección</p>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Dirección..."
                  className="
                    input
                    w-full
                    bg-transparent
                    border-[#79C798]
                    focus:outline-none
                    focus:border-green-600
                  "
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                <input
                  type="text"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  placeholder="Teléfono..."
                  className="
                    input
                    w-full
                    bg-transparent
                    border-[#79C798]
                    focus:outline-none
                    focus:border-green-600
                  "
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Descripción</p>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  placeholder="Descripción de la clínica..."
                  className="
                    textarea
                    w-full
                    bg-transparent
                    border-[#79C798]
                    focus:outline-none
                    focus:border-green-600
                  "
                />
              </div>
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-3xl font-bold text-gray-700">
                  Contacto
                </h2>

                <p className="text-gray-600 mt-2">{center.address}</p>
                <p className="text-gray-600">{center.contact}</p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-gray-700">
                  Descripción
                </h2>

                <p className="text-gray-600 mt-2">{center.description}</p>
              </section>
            </>
          )}

          {/* Guardar / cancelar edición */}
          {isEditing && (
            <div className="flex flex-col gap-2">
              {saveError && (
                <p className="text-red-600 text-center">{saveError}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCancelEdit}
                  className="btn flex-1 rounded-xl border-gray-300"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="
                    btn
                    flex-1
                    bg-green-800
                    hover:bg-green-900
                    border-none
                    text-white
                    rounded-xl
                  "
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>

              {/* Eliminar clínica: solo el dueño la ve, y solo mientras
              esta editando. El backend vuelve a validar que sea el dueño
              antes de borrar nada. */}
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setDeleteError("");
                  }}
                  className="
                    btn
                    btn-outline
                    border-red-600
                    text-red-600
                    hover:bg-red-600
                    hover:text-white
                    hover:border-red-600
                    rounded-xl
                    mt-2
                  "
                >
                  Eliminar clínica
                </button>
              ) : (
                <div className="border border-red-300 bg-red-50 rounded-xl p-4 mt-2 flex flex-col gap-3">
                  <p className="text-red-700 text-center font-semibold">
                    ¿Seguro que desea eliminar esta clínica? Esta acción no
                    se puede deshacer: se eliminará por completo y ya no
                    aparecerá registrada en ningún perfil.
                  </p>

                  {deleteError && (
                    <p className="text-red-600 text-center">{deleteError}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteError("");
                      }}
                      className="btn flex-1 rounded-xl border-gray-300"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDeleteClinic}
                      className="
                        btn
                        flex-1
                        bg-red-600
                        hover:bg-red-700
                        border-none
                        text-white
                        rounded-xl
                      "
                    >
                      {deleting ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {vets.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">
                Veterinarios asociados
              </h2>

              <div className="flex flex-col gap-3">
                {vets.map((vet) => (
                  <Link key={vet.id} to={`/vet-profile/${vet.id}`}>
                    <VetCard
                      name={vet.name}
                      subtitle="Ver perfil"
                      imageUrl={vet.image_url}
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Reseñas */}
        <div className="bg-white rounded-3xl p-4">
          <CommentsSection targetType="veterinary_center" targetId={center.id} />
        </div>
      </main>
    </AuthLayout>
  );
}