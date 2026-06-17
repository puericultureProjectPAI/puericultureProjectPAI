import { useFormikContext } from "formik";
import { FormikInput } from "../FormikInput";

export const GrossesseStep = () => {
  // On récupère les valeurs et les erreurs depuis Formik
  const { touched, errors, values } = useFormikContext();

  // On vérifie s'il y a une erreur sur la date
  const hasError = touched.dpa && errors.dpa;
  // On vérifie si la date est vide (pour griser le jj/mm/aaaa)
  const isEmptyDate = !values.dpa;

  return (
    // On cible UNIQUEMENT le message d'erreur (last-child) pour le mettre en rouge
    <div
      className={`w-full 
      ${hasError ? "[&>div>div:last-child]:!text-feedback-border-alert" : ""}
      ${isEmptyDate ? "[&_input]:!text-subtle" : ""}
    `}
    >
      <FormikInput
        label="Date d'accouchement prévue"
        name="dpa"
        type="date"
        placeholder="JJ/MM/AAAA"
      />
    </div>
  );
};
