import { Field, useFormikContext } from "formik";
import { useState } from "react";
import {
  AGE_RANGE_OPTIONS,
  CONDITION_OPTIONS,
  FRENCH_CITIES,
  MAX_WEIGHT_OPTIONS,
  PRODUCT_CATEGORIES,
} from "../../../../troc/constants/publicationOptions.js";
import { apiClient } from "../../../utils/apiClient.jsx";
import FieldError from "../FieldError.jsx";
import MyImageInput from "../MyImageInput.jsx";

export default function RequiredProductInfoStep() {
  const { values, setFieldValue } = useFormikContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [aiError, setAiError] = useState(null);

  const isTroc = values.mode === "TROC";

  const handleAIRequest = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("images", selectedFile);

    setIsAILoading(true);
    setAiError(null);
    setConfidenceScore(null);

    try {
      const response = await apiClient.post(
        "second-hand/v1/ai/analyze-products",
        formData,
      );

      const {
        title,
        description,
        category,
        condition,
        confidenceScore: score,
      } = response.data;

      if (title) setFieldValue("title", title);
      if (description) setFieldValue("description", description);
      if (category) setFieldValue("category", category);
      if (condition) setFieldValue("condition", condition);
      if (score !== undefined) setConfidenceScore(score);
    } catch {
      setAiError(
        "L'IA n'a pas pu analyser vos images. Veuillez remplir les champs manuellement.",
      );
    } finally {
      setIsAILoading(false);
    }
  };

  const getBadgeStyle = (score) => {
    if (score >= 70) return "border-green-300 bg-green-100 text-green-700";
    if (score >= 35) return "border-orange-300 bg-orange-100 text-orange-700";
    return "border-red-300 bg-red-100 text-red-700";
  };

  const getBadgeEmoji = (score) => {
    if (score >= 70) return "🟢";
    if (score >= 35) return "🟠";
    return "🔴";
  };

  return (
    <div>
      <MyImageInput
        name="images"
        maxImages={5}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setSelectedFile(file);
        }}
      />

      <button
        type="button"
        onClick={handleAIRequest}
        disabled={!selectedFile || isAILoading}
        className={`mb-2 mt-4 w-full flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition-all ${
          !selectedFile || isAILoading
            ? "cursor-not-allowed bg-gray-300"
            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        }`}
      >
        {isAILoading
          ? "Génération en cours... ⏳"
          : "✨ Générer l'annonce avec l'IA"}
      </button>

      {confidenceScore !== null && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${getBadgeStyle(confidenceScore)}`}
        >
          <span>{getBadgeEmoji(confidenceScore)}</span>
          <span>Fiabilité IA : {Math.round(confidenceScore)}%</span>
        </div>
      )}

      {aiError && <p className="mb-4 text-xs text-orange-500">{aiError}</p>}

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="title"
      >
        Nom de l&apos;article
      </label>
      <Field
        className="mb-1 w-full rounded-md border border-[#b8b6c7] px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="title"
        name="title"
        placeholder="Ex : Veste en jean bleue"
      />
      <FieldError name="title" />

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="description"
      >
        Description
      </label>
      <Field
        as="textarea"
        className="mb-1 min-h-16 w-full rounded-md border border-[#b8b6c7] px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="description"
        name="description"
        placeholder="Décrivez l'article..."
      />
      <FieldError name="description" />

      <div className={isTroc ? "mt-4 grid grid-cols-2 gap-3" : "mt-4"}>
        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="category"
          >
            Catégorie
          </label>
          <Field
            as="select"
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="category"
            name="category"
          >
            <option value="">Select</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Field>
          <FieldError name="category" />
        </div>

        {isTroc && (
          <div>
            <label
              className="mb-2 block text-sm font-extrabold text-[#080036]"
              htmlFor="condition"
            >
              État
            </label>
            <Field
              as="select"
              className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
              id="condition"
              name="condition"
            >
              <option value="">Select</option>
              {CONDITION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Field>
            <FieldError name="condition" />
          </div>
        )}
      </div>

      {isTroc && (
        <>
          <label
            className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
            htmlFor="brand"
          >
            Marque
          </label>
          <Field
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="brand"
            name="brand"
            placeholder="Ex : IKEA"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label
                className="mb-2 block text-sm font-extrabold text-[#080036]"
                htmlFor="ageRange"
              >
                Tranche d&apos;âge
              </label>
              <Field
                as="select"
                className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
                id="ageRange"
                name="ageRange"
              >
                <option value="">Select</option>
                {AGE_RANGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-extrabold text-[#080036]"
                htmlFor="maxWeight"
              >
                Poids max
              </label>
              <Field
                as="select"
                className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
                id="maxWeight"
                name="maxWeight"
              >
                <option value="">Select</option>
                {MAX_WEIGHT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
            </div>
          </div>

          <label className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]">
            Dimensions
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Field
                className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#080036]"
                name="dimensionsLong"
                placeholder="Long"
              />
              <span className="absolute right-3 top-2 text-sm text-[#9b9ab0]">
                cm
              </span>
            </div>
            <div className="relative">
              <Field
                className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#080036]"
                name="dimensionsLarg"
                placeholder="Larg"
              />
              <span className="absolute right-3 top-2 text-sm text-[#9b9ab0]">
                cm
              </span>
            </div>
          </div>
        </>
      )}

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="city"
      >
        Ville
      </label>
      {isTroc ? (
        <Field
          as="select"
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
          id="city"
          name="city"
        >
          <option value="">Select</option>
          {FRENCH_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Field>
      ) : (
        <Field
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
          id="city"
          name="city"
          placeholder="Ville"
        />
      )}
      <FieldError name="city" />

      {isTroc && (
        <>
          <label
            className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
            htmlFor="estimatedPrice"
          >
            Prix
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
            <span className="absolute right-3 top-2 text-sm text-[#080036]">
              €
            </span>
          </div>
          <FieldError name="estimatedPrice" />
        </>
      )}
    </div>
  );
}
