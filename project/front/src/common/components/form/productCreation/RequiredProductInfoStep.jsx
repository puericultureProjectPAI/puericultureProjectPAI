import { Field } from "formik";
import {
  CONDITION_OPTIONS,
  PRODUCT_CATEGORIES,
} from "../../../../troc/constants/publicationOptions.js";
import FieldError from "../FieldError.jsx";
import MyImageInput from "../MyImageInput.jsx";

const AI_ERROR_MESSAGE =
  "L’IA n’a pas pu analyser vos images. Veuillez remplir les champs manuellement.";

const buildAiDraft = (imageReference = "") => {
  const fileName = imageReference.split("/").pop() || "";
  const normalizedName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  const suggestedTitle = normalizedName || "Article bébé";

  let score = 88;
  if (/low|faible|13/i.test(imageReference)) {
    score = 13;
  } else if (/medium|moyen|62/i.test(imageReference)) {
    score = 62;
  }

  return {
    category: PRODUCT_CATEGORIES[0],
    condition: CONDITION_OPTIONS[1],
    description:
      "Article détecté depuis la photo. Vérifiez les informations avant publication.",
    estimatedPrice: "29.99",
    score,
    title: suggestedTitle.charAt(0).toUpperCase() + suggestedTitle.slice(1),
  };
};

const getAiScoreStyle = (score) => {
  if (score >= 80) {
    return "border-[#16a34a] bg-[#f0fdf4] text-[#16a34a]";
  }
  if (score >= 50) {
    return "border-[#f97316] bg-[#fff7ed] text-[#f97316]";
  }
  return "border-[#ef4444] bg-[#fef2f2] text-[#ef4444]";
};

export default function RequiredProductInfoStep({
  aiAnalysis,
  setAiAnalysis,
  setFieldValue,
  values,
}) {
  const uploadedImages = Array.isArray(values.images) ? values.images : [];
  const hasImage = uploadedImages.length > 0;
  const lastImageReference = uploadedImages.at(-1) || "";
  const isAiLoading = aiAnalysis.status === "loading";
  const canRunAi = hasImage && !isAiLoading;

  const handleGenerateAnnouncement = async () => {
    if (!canRunAi) {
      return;
    }

    setAiAnalysis({ score: null, status: "loading" });
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (/fail|erreur|error/i.test(lastImageReference)) {
      setAiAnalysis({
        message: AI_ERROR_MESSAGE,
        score: null,
        status: "error",
      });
      return;
    }

    const draft = buildAiDraft(lastImageReference);
    if (!values.title) {
      await setFieldValue("title", draft.title);
    }
    if (!values.description) {
      await setFieldValue("description", draft.description);
    }
    if (!values.category) {
      await setFieldValue("category", draft.category);
    }
    if (!values.condition) {
      await setFieldValue("condition", draft.condition);
    }
    if (!values.estimatedPrice) {
      await setFieldValue("estimatedPrice", draft.estimatedPrice);
    }

    setAiAnalysis({ score: draft.score, status: "success" });
  };

  return (
    <div>
      <p className="mb-2 text-center text-xs font-semibold text-[#5362d6]">
        Max 5 photos JPG ou PNG
      </p>
      <MyImageInput name="images" maxImages={5} />

      <button
        className={`mb-2 mt-3 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-extrabold transition ${
          canRunAi
            ? "bg-[#0a9f51] text-white hover:bg-[#087f42]"
            : "cursor-not-allowed bg-[#c4c2ce] text-white"
        }`}
        disabled={!canRunAi}
        onClick={handleGenerateAnnouncement}
        type="button"
      >
        <span className="material-symbols-rounded text-[18px] leading-none">
          {isAiLoading ? "progress_activity" : "auto_awesome"}
        </span>
        {isAiLoading ? "Analyse des images..." : "Générer l’annonce avec l’IA"}
      </button>

      {aiAnalysis.status === "success" && aiAnalysis.score !== null && (
        <div
          className={`mb-3 flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-center text-xs font-extrabold ${getAiScoreStyle(
            aiAnalysis.score,
          )}`}
        >
          <span className="material-symbols-rounded text-[16px] leading-none">
            lightbulb
          </span>
          Fiabilité IA : {aiAnalysis.score}%
        </div>
      )}

      {aiAnalysis.status === "error" && (
        <p className="mb-3 text-center text-xs font-semibold text-red-600">
          {aiAnalysis.message}
        </p>
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
        placeholder="Décrivez l’article..."
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
