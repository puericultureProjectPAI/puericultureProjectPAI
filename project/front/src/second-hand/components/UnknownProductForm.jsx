import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../common/utils/apiClient";

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
        const payload = {
          ean,
          name: values.name,
          category: values.category,
          price: Number(values.price),
        };

        const res = await apiClient.post("/api/v1/products", payload);

        //  SUCCESS (201 Created)
        if (res.status === 201) {
          setStatus({ success: " Produit ajouté avec succès !" });
          setTimeout(() => {
            onSubmitSuccess?.();
          }, 600);
          return;
        }
      } catch (err) {
        if (err.response) {
          const { status, data } = err.response;

          // 403 (Token manquant ou invalide)
          if (status === 403) {
            setStatus({
              error: " Accès refusé (403). Token invalide ou expiré.",
            });
            return;
          }

          //  Autres erreurs
          const errorMsg = data?.message || `Erreur backend (${status})`;
          setStatus({ error: ` ${errorMsg}` });
        } else {
          console.error(" Erreur réseau :", err);
          setStatus({
            error: "Erreur réseau / serveur injoignable",
          });
        }
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
          onBlur={formik.handleBlur}
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
          onBlur={formik.handleBlur}
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
          onBlur={formik.handleBlur}
          value={formik.values.price}
          className="w-full border border-gray-200 rounded-lg p-2"
        />
        {formik.errors.price && formik.touched.price && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.price}</p>
        )}
      </div>

      {/* EAN (read-only) */}
      <div>
        <label className="text-sm text-gray-600">EAN</label>
        <input
          value={ean}
          disabled
          className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 text-gray-500"
        />
      </div>

      {/* STATUS MESSAGES */}
      {formik.status?.error && (
        <p className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
          {formik.status.error}
        </p>
      )}

      {formik.status?.success && (
        <p className="text-green-600 text-sm mt-2 p-2 bg-green-50 rounded">
          {formik.status.success}
        </p>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="bg-blue-600 text-white rounded-lg p-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {formik.isSubmitting ? " Envoi..." : "Créer le produit"}
      </button>
    </form>
  );
}
