import { Field, ErrorMessage, useFormikContext } from "formik";
import { FormikInput } from "../FormikInput";

export const DetailsStep = () => {
  const { values, touched, errors } = useFormikContext();
  const isParent = values.statut === "parent";

  // Fonction mise à jour : on ne cible plus le first-child (label)
  const getFieldStyle = (fieldName, isDate = false) => {
    const hasError = touched[fieldName] && errors[fieldName];
    const isEmptyDate = isDate && !values[fieldName];

    return `w-full 
      ${hasError ? "[&>div>div:last-child]:!text-feedback-border-alert" : ""}
      ${isEmptyDate ? "[&_input]:!text-subtle" : ""}
    `;
  };

  return (
    <div className="w-full space-y-6">
      {/* INFO BOX */}
      <div className="bg-info text-feedback-background-service text-sm font-medium text-center py-3 rounded-lg w-full mb-2">
        Vous pourrez modifier plus tard !
      </div>

      {/* BOUTONS RADIO GENRE */}
      <div>
        <div className="flex items-center justify-between gap-2">
          {["f", "m", "s"].map((genreKey) => {
            const labels = {
              f: "Fille",
              m: "Garçon",
              s: "Je ne sais\npas encore",
            };
            const isSelected = values.genre === genreKey;

            return (
              <label
                key={genreKey}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <Field
                  type="radio"
                  name="genre"
                  value={genreKey}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 shrink-0 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-color-brand bg-color-brand"
                      : "border-feedback-border-neutral group-hover:border-color-brand"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-base rounded-full" />
                  )}
                </div>
                <span className="text-sm text-neutral whitespace-pre-line leading-tight">
                  {labels[genreKey]}
                </span>
              </label>
            );
          })}
        </div>
        <ErrorMessage
          name="genre"
          component="div"
          className="text-feedback-border-alert text-sm mt-1"
        />
      </div>

      {/* PRÉNOM */}
      <div className={getFieldStyle("prenom")}>
        <FormikInput
          label="Son prénom"
          name="prenom"
          type="text"
          placeholder="Ex: Léo"
        />
      </div>

      {/* DATE DE NAISSANCE - AFFICHÉE UNIQUEMENT SI DÉJÀ PARENT */}
      {isParent && (
        <div className={getFieldStyle("dateNaissance", true)}>
          <FormikInput
            label="Sa date de naissance"
            name="dateNaissance"
            type="date"
            placeholder="JJ/MM/AAAA"
          />
        </div>
      )}
    </div>
  );
};
