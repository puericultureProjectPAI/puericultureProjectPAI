import { useLocation } from "react-router";
import pointsIcon from "../../assets/credit-icon-neutral-m.svg";
import photoIcon from "../../assets/photo-icon-subtle.svg";

export default function ForwardArticleDetailView() {
  const { state } = useLocation();
  const article = state?.article;
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
      <div className="h-32 bg-feedback-background-neutral rounded-lg flex flex-col justify-center items-center gap-2.5">
        <img src={photoIcon} alt="" className="size-12" />
        <span className="text-feedback-text-subtle text-xl font-bold">
          Aucune photo disponible
        </span>
      </div>

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

      <div className="flex flex-col gap-2.5 py-4">
        <button
          type="button"
          className="h-10 rounded-lg outline outline-1 outline-feedback-border-alert text-feedback-background-alert-bold text-base font-semibold"
        >
          Supprimer du lot
        </button>
        <button
          type="button"
          className="h-10 rounded-lg bg-bg-brand text-white text-base font-semibold"
        >
          Réserver
        </button>
      </div>
    </div>
  );
}
