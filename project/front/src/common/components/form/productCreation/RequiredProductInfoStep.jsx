import { Field, useFormikContext } from "formik";
import {
  AGE_RANGE_OPTIONS,
  CITY_OPTIONS,
  CONDITION_OPTIONS,
  PRODUCT_CATEGORIES,
  WEIGHT_OPTIONS,
} from "../../../../troc/constants/publicationOptions.js";
import FieldError from "../FieldError.jsx";
import MyImageInput from "../MyImageInput.jsx";
import { apiClient } from "../../../utils/apiClient.jsx";
import { useState } from "react";

const fieldClassName =
  "w-full rounded-md border border-[#858199] bg-white px-3 py-[9px] text-[14px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]";

const labelClassName =
  "mb-[7px] block text-[16px] font-extrabold leading-tight text-[#080036]";

export default function RequiredProductInfoStep() {
  const { setFieldValue } = useFormikContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [aiError, setAiError] = useState(null);

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
    <div className="font-figtree">
      <div className="mb-[7px] self-stretch">
        <p className="text-center font-normal text-[15px] text-[#3A51C9]">
          Max 5 photos JPG ou PNG
        </p>
      </div>
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

      <label className={`${labelClassName} mt-[15px]`} htmlFor="title">
        Nom de l'article
      </label>
      <Field
        className={fieldClassName}
        id="title"
        name="title"
        placeholder="Ex : Veste en jean bleue"
      />
      <FieldError name="title" />

      <label className={`${labelClassName} mt-[14px]`} htmlFor="description">
        Description
      </label>
      <Field
        as="textarea"
        className={`${fieldClassName} min-h-[66px] resize-none`}
        id="description"
        name="description"
        placeholder="Décrivez l'article..."
      />
      <FieldError name="description" />

      <div className="mt-[18px] grid grid-cols-2 gap-[16px]">
        <div>
          <label className={labelClassName} htmlFor="category">
            Catégorie
          </label>
          <Field
            as="select"
            className={fieldClassName}
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

        <div>
          <label className={labelClassName} htmlFor="condition">
            État
          </label>
          <Field
            as="select"
            className={fieldClassName}
            id="condition"
            name="condition"
          >
            <option value="">Select</option>
            {CONDITION_OPTIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </Field>
          <FieldError name="condition" />
        </div>
      </div>

      <label className={`${labelClassName} mt-[16px]`} htmlFor="brand">
        Marque
      </label>
      <Field
        className={fieldClassName}
        id="brand"
        name="brand"
        placeholder="Ex : KIABI"
      />

      <div className="mt-[18px] grid grid-cols-2 gap-[16px]">
        <div>
          <label className={labelClassName} htmlFor="ageRange">
            Tranche d'âge
          </label>
          <Field
            as="select"
            className={fieldClassName}
            id="ageRange"
            name="ageRange"
          >
            <option value="">Select</option>
            {AGE_RANGE_OPTIONS.map((ageRange) => (
              <option key={ageRange.value} value={ageRange.value}>
                {ageRange.label}
              </option>
            ))}
          </Field>
        </div>

        <div>
          <label className={labelClassName} htmlFor="maxWeightKg">
            Poids max
          </label>
          <Field
            as="select"
            className={fieldClassName}
            id="maxWeightKg"
            name="maxWeightKg"
          >
            <option value="">Select</option>
            {WEIGHT_OPTIONS.map((weight) => (
              <option key={weight.value} value={weight.value}>
                {weight.label}
              </option>
            ))}
          </Field>
        </div>
      </div>

      <label className={`${labelClassName} mt-[18px]`} htmlFor="lengthCm">
        Dimensions
      </label>
      <div className="grid grid-cols-2 gap-[16px]">
        <div className="relative">
          <Field
            className={`${fieldClassName} pr-[44px]`}
            id="lengthCm"
            name="lengthCm"
            placeholder="Long"
            type="number"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#555261]">
            cm
          </span>
        </div>

        <div className="relative">
          <Field
            className={`${fieldClassName} pr-[44px]`}
            id="widthCm"
            name="widthCm"
            placeholder="Larg"
            type="number"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#555261]">
            cm
          </span>
        </div>
      </div>

      <label className={`${labelClassName} mt-[18px]`} htmlFor="city">
        Ville
      </label>
      <Field as="select" className={fieldClassName} id="city" name="city">
        <option value="">Select</option>
        {CITY_OPTIONS.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </Field>

      <label className={`${labelClassName} mt-[18px]`} htmlFor="price">
        Prix
      </label>
      <div className="relative">
        <Field
          className={`${fieldClassName} pr-[42px]`}
          id="price"
          min="0"
          name="price"
          placeholder="0,00"
          step="0.01"
          type="number"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[18px] font-semibold text-[#2f2d3c]">
          €
        </span>
      </div>
    </div>
  );
}
