import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import MyTextInput from "../../common/components/form/MyTextInput";
import ImageUploader from "../components/ImageUploader";
import { createTrocProduct } from "../utils/trocProductApi";
import { addProductImages } from "../utils/productImageApi";

const CATEGORIES = [
  { value: "VETEMENTS", label: "Vêtements (filles & garçons)" },
  { value: "JEUX_JOUETS", label: "Jeux et jouets" },
  { value: "TRANSPORT_BEBE", label: "Poussettes, porte-bébés et sièges auto" },
  { value: "MEUBLES_DECO", label: "Meubles et décoration" },
  { value: "BAIN_CHANGE", label: "Bain et change" },
  { value: "SECURITE_BEBE_ENFANT", label: "Sécurité bébé et enfant" },
  { value: "ALLAITEMENT_ALIMENTATION", label: "Allaitement et alimentation" },
  { value: "SOMMEIL_LITERIE", label: "Sommeil et literie" },
  { value: "SANTE_GROSSESSE", label: "Santé et grossesse" },
  { value: "AUTRES", label: "Autres articles pour bébé et enfant" },
];

const validationSchema = Yup.object({
  postTitle: Yup.string().required("Le titre est requis."),
  description: Yup.string().required("La description est requise."),
  city: Yup.string().required("La ville est requise."),
  category: Yup.string().required("La catégorie est requise."),
  estimatedPrice: Yup.number()
    .nullable()
    .transform((v) => (isNaN(v) ? null : v))
    .positive("Le prix estimé doit être positif."),
});

export default function CreateTrocView() {
  const [imageUrls, setImageUrls] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(values, { setSubmitting }) {
    setSubmitError("");
    try {
      const response = await createTrocProduct(values);
      const productId = response.data.id;
      if (imageUrls.length > 0) {
        await addProductImages(productId, imageUrls);
      }
      navigate(`/troc/${productId}`);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Une erreur est survenue.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Publier une annonce troc
      </h1>

      <Formik
        initialValues={{
          postTitle: "",
          description: "",
          city: "",
          category: "",
          estimatedPrice: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <MyTextInput
              label="Titre de l'annonce"
              name="postTitle"
              type="text"
            />
            <MyTextInput label="Description" name="description" type="text" />
            <MyTextInput label="Ville" name="city" type="text" />

            <div>
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Catégorie
              </label>
              <Field
                as="select"
                name="category"
                id="category"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <MyTextInput
              label="Prix estimé en cents (optionnel)"
              name="estimatedPrice"
              type="number"
            />

            <ImageUploader onImagesChange={setImageUrls} />

            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-transform disabled:opacity-50"
            >
              {isSubmitting ? "Publication en cours..." : "Publier l'annonce"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
