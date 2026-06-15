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
import { useEffect, useState } from "react";

const fieldClassName =
  "w-full rounded-md border border-[#858199] bg-white px-3 py-[9px] text-[14px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]";

const labelClassName =
  "mb-[7px] block text-[16px] font-extrabold leading-tight text-[#080036]";

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
          if (file) {
            setSelectedFile(file);
          }
        }}
      />

      {selectedFile && values.mode === "SECOND_HAND" && (
        <button
          type="button"
          onClick={handleAIRequest}
          disabled={isAILoading}
          className="mt-4 mb-4 w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50"
        >
          {isAILoading ? "Génération en cours... ⏳" : "💡 Générer avec l'IA"}
        </button>
      )}

      {confidenceScore !== null && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${getBadgeStyle(confidenceScore)}`}
        >
          <span>{getBadgeEmoji(confidenceScore)}</span>
          <span>Fiabilité IA : {Math.round(confidenceScore)}%</span>
        </div>
      )}

      <label className={`${labelClassName} mt-[15px]`} htmlFor="title">
        Nom de l'article <span className="text-red-500 ml-1">*</span>
      </label>
      <Field
        className={fieldClassName}
        id="title"
        name="title"
        placeholder="Ex : Veste en jean bleue"
      />
      <FieldError name="title" />

      <label className={`${labelClassName} mt-[14px]`} htmlFor="description">
        Description <span className="text-red-500 ml-1">*</span>
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
            Catégorie <span className="text-red-500 ml-1">*</span>
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
            État <span className="text-red-500 ml-1">*</span>
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
            placeholder="Longueur"
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
            placeholder="Largeur"
            type="number"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#555261]">
            cm
          </span>
        </div>
      </div>

      <label className={`${labelClassName} mt-[18px]`} htmlFor="city">
        Ville
        {values.mode === "LOCATION" && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>
      <Field as="select" className={fieldClassName} id="city" name="city">
        <option value="">Select</option>
        {CITY_OPTIONS.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </Field>
      {values.mode === "LOCATION" && <FieldError name="city" />}

      <div>
        <div>
          {values.mode === "TROC" ? (
            <TrocCard />
          ) : values.mode === "LOCATION" ? (
            <LocationCard />
          ) : (
            <SecondHandCard />
          )}
        </div>
      </div>
    </div>
  );
}

function PriceInput({ id, name, placeholder = "0,00" }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className={`flex items-center w-full ${fieldClassName}`}>
        <Field
          className="flex-1 min-w-0 bg-transparent outline-none"
          id={id}
          min="0"
          name={name}
          placeholder={placeholder}
          step="0.01"
          type="number"
        />
        <span className="select-none text-[22px] font-semibold text-[#2f2d3c] ml-2">
          €
        </span>
      </div>
      <FieldError name={name} />
    </div>
  );
}

function LocationCard() {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const perDay = Number(values.pricePerDay);
    if (!isNaN(perDay) && perDay >= 0) {
      setFieldValue("pricePerMonth", Math.round(perDay * 30));
    }
  }, [values.pricePerDay, setFieldValue]);

  return (
    <div className="pt-2">
      <div className="grid grid-cols-2 gap-[20px]">
        <div>
          <label className={labelClassName} htmlFor="pricePerDay">
            Prix / jour <span className="text-red-500 ml-1">*</span>
          </label>
          <PriceInput id="pricePerDay" name="pricePerDay" placeholder="0" />
        </div>

        <div>
          <label className={labelClassName} htmlFor="pricePerMonth">
            Prix / mois
          </label>
          <div className="flex flex-col gap-1 w-full">
            <div className={`flex items-center w-full ${fieldClassName}`}>
              <Field
                className="flex-1 min-w-0 bg-transparent outline-none cursor-not-allowed"
                disabled
                id="pricePerMonth"
                name="pricePerMonth"
                type="number"
              />
              <span className="select-none text-[22px] font-semibold text-[#2f2d3c] ml-2">
                €
              </span>
            </div>
            <p className="text-[12px] text-[#6b6b8a]">
              Calculé automatiquement (× 30)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrocCard() {
  return (
    <div className="pt-2">
      <label className={`${labelClassName} pt-2`} htmlFor="estimatedPrice">
        Prix estimé <span className="text-red-500 ml-1">*</span>
      </label>
      <PriceInput id="estimatedPrice" name="estimatedPrice" />
    </div>
  );
}

function SecondHandCard() {
  return (
    <div className="pt-2">
      <label className={`${labelClassName} pt-2`} htmlFor="price">
        Prix <span className="text-red-500 ml-1">*</span>
      </label>
      <PriceInput id="price" name="price" />
    </div>
  );
}
