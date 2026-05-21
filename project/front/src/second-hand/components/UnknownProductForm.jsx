import { useFormik } from "formik";
import * as Yup from "yup";

const categories = [
  "Vêtements (filles & garçons)",
  "Jeux et jouets",
  "Poussettes, porte-bébés et sièges auto",
  "Meubles et décoration",
  "Bain et change",
  "Sécurité bébé et enfant",
  "Allaitement et alimentation",
  "Sommeil et literie",
  "Santé et grossesse",
  "Autres articles pour bébé et enfant",
];

export default function UnknownProductForm({ ean, onSubmitSuccess }) {
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      price: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Nom requis"),
      category: Yup.string().required("Catégorie requise"),
      price: Yup.number()
        .typeError("Prix invalide")
        .required("Prix requis")
        .min(0.01, "Minimum 0.01€"),
    }),

    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null);

      try {
        const res = await fetch("/api/v1/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ean,
            name: values.name,
            category: values.category,
            price: Number(values.price),
            brand: null,
            imageUrl: null,
          }),
        });

        if (res.status === 201) {
          setStatus({ success: "Produit ajouté avec succès !" });

          setTimeout(() => {
            onSubmitSuccess?.();
          }, 600);
        } else {
          setStatus({
            error: "Erreur lors de la création du produit.",
          });
        }
      } catch {
        setStatus({
          error: "Erreur réseau.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      {/* NAME */}
      <div>
        <label className="text-sm text-gray-600">Nom du produit</label>
        <input
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
          className="w-full border border-gray-200 rounded-lg p-2"
        />
        {formik.errors.name && formik.touched.name && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
        )}
      </div>

      {/* CATEGORY */}
      <div>
        <label className="text-sm text-gray-600">Catégorie</label>
        <select
          name="category"
          onChange={formik.handleChange}
          value={formik.values.category}
          className="w-full border border-gray-200 rounded-lg p-2"
        >
          <option value="">Choisir...</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {formik.errors.category && formik.touched.category && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
        )}
      </div>

      {/* PRICE */}
      <div>
        <label className="text-sm text-gray-600">Prix neuf estimé (€)</label>
        <input
          type="number"
          step="0.01"
          name="price"
          onChange={formik.handleChange}
          value={formik.values.price}
          className="w-full border border-gray-200 rounded-lg p-2"
        />

        {formik.errors.price && formik.touched.price && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.price}</p>
        )}
      </div>

      {/* EAN */}
      <div>
        <label className="text-sm text-gray-600">EAN</label>
        <input
          value={ean}
          disabled
          className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 text-gray-500"
        />
      </div>

      {/* STATUS */}
      {formik.status?.error && (
        <p className="text-red-500 text-sm">{formik.status.error}</p>
      )}

      {formik.status?.success && (
        <p className="text-green-600 text-sm">{formik.status.success}</p>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="bg-blue-600 text-white rounded-lg p-2 text-sm"
      >
        {formik.isSubmitting ? "Envoi..." : "Créer le produit"}
      </button>
    </form>
  );
}
