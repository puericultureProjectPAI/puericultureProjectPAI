import { useFormikContext } from "formik";
import bottleIcon from "../../../assets/onboarding/bottle-icon-brand.svg";

export const StatusStep = ({ onSelect }) => {
  const { values } = useFormikContext();

  return (
    <div className="w-full space-y-4">
      {/* Option Grossesse */}
      <button
        type="button"
        onClick={() => onSelect("grossesse")}
        className={`w-full border rounded-lg p-4 flex items-center gap-4 transition-colors text-left ${
          values.statut === "grossesse"
            ? "border-color-brand bg-info"
            : "border-feedback-border-neutral hover:border-color-brand"
        }`}
      >
        <div className="w-12 h-12 bg-feedback-background-warning-low rounded-md flex items-center justify-center text-color-brand font-bold text-xl">
          <img src={bottleIcon} alt="Bouteille" className="w-8 h-8" />
        </div>
        <span className="text-color-brand font-bold text-base leading-tight">
          J'attends un
          <br />
          heureux événement
        </span>
      </button>

      {/* Option Déjà Parent */}
      <button
        type="button"
        onClick={() => onSelect("parent")}
        className={`w-full border rounded-lg p-4 flex items-center gap-4 transition-colors text-left ${
          values.statut === "parent"
            ? "border-color-brand bg-info"
            : "border-feedback-border-neutral hover:border-color-brand"
        }`}
      >
        <div className="w-12 h-12 bg-feedback-background-warning-low rounded-md flex items-center justify-center text-color-brand font-bold text-xl">
          <img src={bottleIcon} alt="Bouteille" className="w-8 h-8" />
        </div>
        <span className="text-color-brand font-bold text-base leading-tight">
          Je suis déjà
          <br />
          parent
        </span>
      </button>
    </div>
  );
};
