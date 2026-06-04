import { Field, useFormikContext } from "formik";
import { PRODUCT_CATEGORIES } from "../../../../troc/constants/publicationOptions.js";
import MyImageInput from "../MyImageInput.jsx";
import FieldError from "../FieldError.jsx";
import { useState } from "react";
import { apiClient } from "../../../utils/apiClient.jsx";

export default function RequiredProductInfoStep() {
  const { values, setFieldValue } = useFormikContext();
  // ai second main
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const handleAIRequest = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("images", selectedFile);

    setIsAILoading(true);
    console.log("Envoi de l'image à l'IA Gemini...");

    try {
      // Utilisation de apiClient qui ajoute automatiquement le token (Bearer)

      // On utilise "v1/ai/analyze-products" car le contexte est déjà configuré
      const response = await apiClient.post("v1/ai/analyze-products", formData);

      console.log(" === RÉSULTAT IA GEMINI ===", response.data);
    } catch (error) {
      console.error(" === ERREUR IA GEMINI ===", error);
    } finally {
      setIsAILoading(false);
    }
  }; //

  return (
    <div>
      <MyImageInput
        name="images"
        maxImages={5}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            setSelectedFile(file);
            setFieldValue("imageReference", file.name);
          }
        }}
      />

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="title"
      >
        {/* BOUTON IA uniquement pour la seconde*/}
        {selectedFile && values.mode === "SECOND_HAND" && (
          <button
            type="button"
            onClick={handleAIRequest}
            disabled={isAILoading}
            className="mb-6 w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50"
          >
            {isAILoading ? "Génération en cours... ⏳" : "💡 Générer avec l'IA"}
          </button>
        )}
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
