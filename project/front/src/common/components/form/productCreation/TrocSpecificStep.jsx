import { Field, useFormikContext } from "formik";
import { useEffect } from "react";
import { CONDITION_OPTIONS } from "../../../../troc/constants/publicationOptions.js";
import useConditionAnalysis from "../../../../troc/hooks/useConditionAnalysis.js";
import FieldError from "../FieldError.jsx";

export default function TrocSpecificStep() {
  const { values, setFieldValue } = useFormikContext();
  const {
    analyzeCondition,
    suggestion,
    confidenceScore,
    isAnalyzing,
    error,
    multipleItemsDetected,
  } = useConditionAnalysis();

  const firstImage = Array.isArray(values.images) ? values.images[0] : null;

  useEffect(() => {
    if (firstImage) {
      analyzeCondition(firstImage);
    }
  }, [firstImage]);

  useEffect(() => {
    if (suggestion && !values.condition) {
      setFieldValue("condition", suggestion);
    }
  }, [suggestion]);

  return (
    <div className="rounded-lg bg-[#f5f4fb] p-4">
      <h2 className="mb-4 text-center text-sm font-extrabold text-[#080036]">
        Troc
      </h2>

      <label
        className="mb-2 block text-sm font-extrabold text-[#080036]"
        htmlFor="estimatedPrice"
      >
        Prix estimé
      </label>
      <div className="relative">
        <Field
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-8 text-sm outline-none focus:border-[#080036]"
          id="estimatedPrice"
          min="0"
          name="estimatedPrice"
          placeholder="0,00"
          step="0.01"
          type="number"
        />
        <span className="absolute right-3 top-2 text-sm text-[#080036]">€</span>
      </div>
      <FieldError name="estimatedPrice" />

      <div className="mt-4">
        <label
          className="mb-2 block text-sm font-extrabold text-[#080036]"
          htmlFor="condition"
        >
          État de l'article
        </label>

        {isAnalyzing && (
          <p className="mb-2 text-xs text-[#5362d6]">
            Analyse de l'image en cours...
          </p>
        )}

        {!isAnalyzing && suggestion && (
          <div className="mb-2 flex items-center gap-2 rounded-md border border-[#5362d6] bg-white px-3 py-2 text-xs text-[#5362d6]">
            <span>Suggestion IA : {suggestion}</span>
            {confidenceScore > 0 && (
              <span className="ml-auto text-[#9b99b5]">
                {confidenceScore}% de confiance
              </span>
            )}
          </div>
        )}

        {!isAnalyzing && multipleItemsDetected && (
          <p className="mb-2 text-xs text-orange-500">
            Plusieurs articles ont été détectés sur la photo. Sélectionnez
            l&apos;article concerné ou reprenez une photo plus précise.
          </p>
        )}

        {!isAnalyzing && error && (
          <p className="mb-2 text-xs text-orange-500">{error}</p>
        )}

        <Field
          as="select"
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
          id="condition"
          name="condition"
        >
          <option value="">Sélectionner un état</option>
          {CONDITION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Field>
        <FieldError name="condition" />
        <p className="mt-1 text-xs text-[#9b99b5]">
          Vous pouvez modifier la suggestion avant publication.
        </p>
      </div>
    </div>
  );
}
