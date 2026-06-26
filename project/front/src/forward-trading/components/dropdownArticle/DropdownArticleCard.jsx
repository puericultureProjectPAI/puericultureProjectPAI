import checkedIcon from "../../../assets/checked-icon-success-m.svg";
import pendingIcon from "../../../assets/pending-icon-brand-m.svg";

export default function DropdownArticleCard({
  nom,
  prix,
  duree,
  reserved = false,
}) {
  return (
    <div className="w-full p-5 bg-bg-base rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-feedback-border-neutral inline-flex justify-start items-center gap-3 overflow-hidden">
      {/* Thumbnail placeholder */}
      <div className="size-16 p-2.5 bg-feedback-background-neutral rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden shrink-0">
        <div className="size-12 bg-feedback-icon-subtle" />
      </div>

      {/* Infos */}
      <div className="flex-1 max-w-52 flex flex-col justify-start items-start gap-2">
        <span className="text-brand text-xl font-bold font-figtree">{nom}</span>
        <span className="text-neutral text-base font-normal font-figtree">
          {prix}€
        </span>
        {duree && (
          <span className="text-neutral text-base font-normal font-figtree">
            {duree} mois
          </span>
        )}
      </div>

      {/* Icône statut */}
      <img
        src={reserved ? checkedIcon : pendingIcon}
        alt={reserved ? "Réservé" : "En attente"}
        className="size-6 shrink-0 ml-auto"
      />
    </div>
  );
}
