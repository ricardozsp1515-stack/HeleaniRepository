import { useEffect, useState } from "react";

import CommentCard from "../cards/CommentCard";
import CommentForm from "../forms/CommentForm";

import { getVetComments, getCenterComments, deleteComment } from "../../services/commentService";
import { getProfile, getPublicProfile } from "../../services/userServices";

interface RawComment {
  id: string;
  user_id: string;
  stars: number;
  comment: string;
  created_at: string;
}

interface Comment extends RawComment {
  authorName: string;
  authorImageUrl?: string;
}

interface CommentsSectionProps {
  targetType: "veterinarian" | "veterinary_center";
  targetId: string;
}

// Componente contenedor que sí habla con el backend (a diferencia de
// CommentCard/CommentForm, que solo reciben props). Se usa igual desde
// VetProfile.tsx y ClinicProfile.tsx, cambiando solo targetType/targetId.
export default function CommentsSection({
  targetType,
  targetId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Datos del usuario logueado: se piden con getProfile() (no
  // getCurrentUser() de localStorage) porque acá necesitamos el
  // role_name para saber si es admin, y el localStorage no lo guarda.
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role_name: string;
  } | null>(null);

  // "new" = mostrando el formulario para crear una reseña nueva.
  // id de un comentario = mostrando el formulario de edición sobre ese.
  // null = no hay ningún formulario abierto.
  const [editingId, setEditingId] = useState<string | null>(null);

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // Carga (o recarga) todo lo necesario: perfil propio, comentarios, y
  // los datos publicos (nombre/foto) de cada autor. Opción A de la Fase
  // 0: el backend solo devuelve user_id, así que completamos el resto
  // acá, pidiendo cada perfil público una sola vez por autor único.
  const loadData = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const [profile, rawComments]: [any, RawComment[]] = await Promise.all([
        getProfile().catch(() => null),
        targetType === "veterinarian"
          ? getVetComments(targetId)
          : getCenterComments(targetId),
      ]);

      setCurrentUser(
        profile ? { id: profile.id, role_name: profile.role_name } : null
      );

      const uniqueUserIds = Array.from(
        new Set(rawComments.map((c) => c.user_id))
      );

      const authorEntries = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const author = await getPublicProfile(userId);
            return [userId, author] as const;
          } catch {
            // Si por alguna razón el perfil público falla (ej. usuario
            // eliminado), no tumbamos toda la sección por eso.
            return [userId, null] as const;
          }
        })
      );

      const authorsById = new Map(authorEntries);

      const enrichedComments: Comment[] = rawComments
        .map((c) => {
          const author = authorsById.get(c.user_id);

          return {
            ...c,
            authorName: author?.name ?? "Usuario",
            authorImageUrl: author?.image_url,
          };
        })
        // Más recientes primero; el backend no las devuelve ordenadas.
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      setComments(enrichedComments);
    } catch (err: any) {
      setLoadError(err.message || "No se pudieron cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetType, targetId]);

  const isAdmin = currentUser?.role_name === "admin";

  // Regla de negocio definida en la Fase 0: un usuario puede tener como
  // máximo una reseña activa por veterinario/clínica. Si ya dejó una, no
  // se le ofrece el formulario de "nueva reseña" — solo puede editar la
  // que ya tiene, desde el botón "Editar" de su propia card.
  const myComment = currentUser
    ? comments.find((c) => c.user_id === currentUser.id) ?? null
    : null;

  const totalReviews = comments.length;
  const averageStars =
    totalReviews > 0
      ? comments.reduce((sum, c) => sum + c.stars, 0) / totalReviews
      : 0;

  const handleFormSuccess = () => {
    setEditingId(null);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (!confirmingDeleteId || !currentUser) return;

    const target = comments.find((c) => c.id === confirmingDeleteId);
    if (!target) return;

    setDeletingId(confirmingDeleteId);
    setDeleteError("");

    // Si un admin borra una reseña ajena, hay que mandar ?user=<dueño>
    // (ver commentService.ts / Fase 1). Si borra la propia, no hace falta.
    const asAdminForUser =
      isAdmin && target.user_id !== currentUser.id
        ? target.user_id
        : undefined;

    try {
      await deleteComment(confirmingDeleteId, asAdminForUser);
      setConfirmingDeleteId(null);
      await loadData();
    } catch (err: any) {
      setDeleteError(err.message || "No se pudo eliminar la reseña.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-3 mt-4">
        <h2 className="text-xl font-bold text-gray-700">Reseñas</h2>
        <p className="text-center text-gray-600">Cargando reseñas...</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-700">Reseñas</h2>

        {totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {averageStars.toFixed(1)} ({totalReviews})
            </span>
          </div>
        )}
      </div>

      {loadError && <p className="text-red-600 text-sm">{loadError}</p>}

      {/* Botón para dejar una reseña nueva: solo si hay sesión, el
      formulario no está ya abierto, y el usuario no tiene una reseña
      activa todavía (ver regla de negocio de la Fase 0). */}
      {currentUser && !myComment && editingId !== "new" && (
        <button
          type="button"
          onClick={() => setEditingId("new")}
          className="
            btn
            btn-sm
            bg-green-800
            hover:bg-green-900
            border-none
            text-white!
            rounded-xl
            self-start
            w-full
          "
        >
          Dejar una reseña
        </button>
      )}

      {editingId === "new" && (
        <CommentForm
          mode="create"
          targetType={targetType}
          targetId={targetId}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingId(null)}
        />
      )}

      {totalReviews === 0 && editingId !== "new" && (
        <p className="text-center text-gray-500 text-sm">
          Todavía no hay reseñas. Sé el primero en dejar una.
        </p>
      )}

      {comments.map((c) => {
        const canManage =
          !!currentUser && (c.user_id === currentUser.id || isAdmin);

        if (editingId === c.id) {
          return (
            <CommentForm
              key={c.id}
              mode="edit"
              commentId={c.id}
              initialStars={c.stars}
              initialComment={c.comment}
              onSuccess={handleFormSuccess}
              onCancel={() => setEditingId(null)}
            />
          );
        }

        return (
          <CommentCard
            key={c.id}
            authorName={c.authorName}
            authorImageUrl={c.authorImageUrl}
            stars={c.stars}
            comment={c.comment}
            createdAt={c.created_at}
            canManage={canManage}
            onEdit={() => setEditingId(c.id)}
            onDelete={() => setConfirmingDeleteId(c.id)}
            deleting={deletingId === c.id}
          />
        );
      })}

      {/* Modal de confirmación antes de eliminar, mismo patrón que usa
      SideMenu.tsx para "Eliminar perfil". */}
      {confirmingDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-85 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800">
              ¿Eliminar esta reseña?
            </h3>

            <p className="text-gray-600">
              Esta acción no se puede deshacer.
            </p>

            {deleteError && (
              <p className="text-red-600 text-center">{deleteError}</p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                disabled={deletingId !== null}
                onClick={() => setConfirmingDeleteId(null)}
                className="btn flex-1 rounded-xl border-gray-300"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={deletingId !== null}
                onClick={handleConfirmDelete}
                className="btn flex-1 rounded-xl bg-red-600 hover:bg-red-700 border-none text-white"
              >
                {deletingId !== null ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}