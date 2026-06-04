import { Field, useFormikContext } from "formik";
import { PRODUCT_CATEGORIES } from "../../../../troc/constants/publicationOptions.js";
import MyImageInput from "../MyImageInput.jsx";
import FieldError from "../FieldError.jsx";
import { useState } from "react";
import { apiClient } from "../../../utils/apiClient.jsx";

export default function RequiredProductInfoStep() {
  const { values, setFieldValue } = useFormikContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(null);

  const handleAIRequest = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("images", selectedFile);

    setIsAILoading(true);

    try {
      const response = await apiClient.post(
        "second-hand/v1/ai/analyze-products",
        formData,
      );

      const { title, description, category, confidenceScore } = response.data;

      if (title) setFieldValue("title", title);
      if (description) setFieldValue("description", description);
      if (category) setFieldValue("category", category);
      if (confidenceScore !== undefined) setConfidenceScore(confidenceScore);
    } catch (error) {
      console.error("Erreur IA Gemini", error);
    } finally {
      setIsAILoading(false);
    }
  };

  const getBadgeStyle = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-300";
    if (score >= 50) return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  const getBadgeEmoji = (score) => {
    if (score >= 80) return "🟢";
    if (score >= 50) return "🟠";
    return "🔴";
  };

  return (
    <div>
      <MyImageInput
        name="images"
        maxImages={5}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            setSelectedFile(file);
          }
        }}
      />

      {/* BOUTON IA uniquement pour la seconde main */}
      {selectedFile && values.mode === "SECOND_HAND" && (
        <button
          type="button"
          onClick={handleAIRequest}
          disabled={isAILoading}
          className="mb-4 w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50"
        >
          {isAILoading ? "Génération en cours... ⏳" : "💡 Générer avec l'IA"}
        </button>
      )}

      {/* BADGE CONFIANCE */}
      {confidenceScore !== null && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${getBadgeStyle(confidenceScore)}`}
        >
          <span>{getBadgeEmoji(confidenceScore)}</span>
          <span>Fiabilité IA : {Math.round(confidenceScore)}%</span>
        </div>
      )}

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="title"
      >
        Nom de l'article
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

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
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

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="city"
      >
        Ville
      </label>
      <Field
        className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="city"
        name="city"
        placeholder="Ville"
      />
      <FieldError name="city" />
    </div>
  );
}