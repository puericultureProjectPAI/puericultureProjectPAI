import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import pointsIcon from "../../assets/credit-icon-neutral-m.svg";
import photoIcon from "../../assets/photo-icon-subtle.svg";

const DELETE_REASONS = [
  { key: "DEJA_POSSEDE", label: "Je possède déjà cet article" },
  { key: "NE_PLUS_RECOMMANDER", label: "Ne plus recommander cet article" },
  { key: "TYPE_ACHAT_INADAPTE", label: "Le type d'achat ne me convient pas" },
];

export default function ForwardArticleDetailView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const article = state?.article;

  const [reservationStatus, setReservationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null); // null | "success" | "error"
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReserver = async () => {
    setIsLoading(true);
    setReservationStatus(null);
    try {
      // TODO: remplacer par le vrai appel quand l'endpoint est prêt
      // const response = await fetch(`/api/timeline-events/${article.id}/reserve`, { method: "PATCH" });
      // if (!response.ok) throw new Error("Échec de la réservation");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setReservationStatus("success");
      setTimeout(() => {
        navigate(`/lot/${article.lotId}`);
      }, 1500);
    } catch {
      setReservationStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupprimer = async () => {
    // const handleSupprimer = async (raison) => {
    setIsDeleting(true);
    setDeleteStatus(null);
    try {
      // TODO: remplacer par le vrai appel quand l'endpoint est prêt
      // const response = await fetch(`/api/timeline-events/${article.id}?raison=${raison}`, { method: "DELETE" });
      // if (!response.ok) throw new Error("Échec de la suppression");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setDeleteStatus("success");
      setTimeout(() => {
        navigate(`/lot/${article.lotId}`);
      }, 1500);
    } catch {
      setDeleteStatus("error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!article || article.isValide === false) {
    return (
      <div className="max-w-md mx-auto p-6 text-center font-figtree">
        <p className="text-feedback-text-subtle text-base">
          Pas d'informations disponibles, problème technique
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-10 flex flex-col gap-4 font-figtree">
      {/* Photo (placeholder from mockup) */}
      <div className="h-32 bg-feedback-background-neutral rounded-lg flex flex-col justify-center items-center gap-2.5">
        <img src={photoIcon} alt="" className="size-12" />
        <span className="text-feedback-text-subtle text-xl font-bold">
          Aucune photo disponible
        </span>
      </div>

      {/* Forward Trading badge */}
      <div className="flex justify-end">
        <span className="px-3 py-2 rounded-xl outline outline-1 outline-feedback-border-brand text-feedback-text-brand text-base">
          Forward Trading
        </span>
      </div>

      <h1 className="text-text-brand text-3xl font-bold">{article.nom}</h1>

      <hr className="border-feedback-border-neutral" />

      <div className="flex items-center gap-2.5">
        <span className="w-32 text-text-neutral text-xl font-bold">Prix</span>
        <span className="text-text-subtle text-base">{article.prix}€</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="w-32 text-text-neutral text-xl font-bold">Durée</span>
        <span className="text-text-subtle text-base">{article.duree} mois</span>
      </div>
      <div className="flex items-center gap-2.5">
        <img src={pointsIcon} alt="" className="size-6" />
        <span className="w-24 text-text-neutral text-xl font-bold">Points</span>
        <span className="text-text-subtle text-base">
          {article.points != null ? `${article.points} points` : "—"}
        </span>
      </div>

      <hr className="border-feedback-border-neutral" />

      {/* Feedback réservation */}
      {reservationStatus === "success" && (
        <p className="text-center text-feedback-text-success text-base font-semibold">
          Votre article est bien réservé.
        </p>
      )}
      {reservationStatus === "error" && (
        <p className="text-center text-feedback-text-alert text-base font-semibold">
          La réservation a échoué. Veuillez réessayer.
        </p>
      )}

      {/* Menu suppression */}
      {showDeleteMenu && (
        <div className="flex flex-col gap-2">
          <p className="text-text-neutral text-base font-semibold">
            Pourquoi supprimer cet article ?
          </p>
          {DELETE_REASONS.map((reason) => (
            <button
              key={reason.key}
              type="button"
              onClick={() => handleSupprimer(reason.key)}
              disabled={isDeleting || deleteStatus === "success"}
              className="h-10 px-3 rounded-lg outline outline-1 outline-feedback-border-neutral text-text-neutral text-base text-left disabled:opacity-50"
            >
              {reason.label}
            </button>
          ))}
          {deleteStatus === "success" && (
            <p className="text-center text-feedback-text-success text-base font-semibold">
              Article supprimé avec succès.
            </p>
          )}
          {deleteStatus === "error" && (
            <p className="text-center text-feedback-text-alert text-base font-semibold">
              La suppression a échoué. Veuillez réessayer.
            </p>
          )}
        </div>
      )}

      {/* Buttons: actions belong to PUE-310 / PUE-311, only displayed here */}
      <div className="flex flex-col gap-2.5 py-4">
        <button
          type="button"
          onClick={() => setShowDeleteMenu((prev) => !prev)}
          disabled={isDeleting || deleteStatus === "success"}
          className="h-10 rounded-lg outline outline-1 outline-feedback-border-alert text-feedback-background-alert-bold text-base font-semibold disabled:opacity-50"
        >
          Supprimer du lot
        </button>
        <button
          type="button"
          onClick={handleReserver}
          disabled={isLoading || reservationStatus === "success"}
          className="h-10 rounded-lg bg-bg-brand text-white text-base font-semibold disabled:opacity-50"
        >
          {isLoading ? "Réservation…" : "Réserver"}
        </button>
      </div>
    </div>
  );
}
