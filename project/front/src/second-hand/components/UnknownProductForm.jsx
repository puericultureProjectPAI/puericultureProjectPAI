import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../common/utils/apiClient";
import { PRODUCT_CATEGORIES } from "../../troc/constants/publicationOptions";

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

        const res = await apiClient.post("/v1/products", payload);

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
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-extrabold text-[#080036]"
        >
          Nom du produit
        </label>
        <input
          id="name"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
        />
        {formik.errors.name && formik.touched.name && (
          <span className="mt-1 block text-xs font-medium text-red-600">
            {formik.errors.name}
          </span>
        )}
      </div>

      {/* CATEGORY */}
      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-extrabold text-[#080036]"
        >
          Catégorie
        </label>
        <select
          id="category"
          name="category"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.category}
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
        >
          <option value="">Choisir...</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {formik.errors.category && formik.touched.category && (
          <span className="mt-1 block text-xs font-medium text-red-600">
            {formik.errors.category}
          </span>
        )}
      </div>

      {/* PRICE */}
      <div>
        <label
          htmlFor="price"
          className="mb-2 block text-sm font-extrabold text-[#080036]"
        >
          Prix neuf estimé (€)
        </label>
        <input
          type="number"
          step="0.01"
          id="price"
          name="price"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.price}
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
        />
        {formik.errors.price && formik.touched.price && (
          <span className="mt-1 block text-xs font-medium text-red-600">
            {formik.errors.price}
          </span>
        )}
      </div>

      {/* EAN (read-only) */}
      <div>
        <label
          htmlFor="ean"
          className="mb-2 block text-sm font-extrabold text-[#080036]"
        >
          EAN
        </label>
        <input
          id="ean"
          value={ean}
          disabled
          className="w-full rounded-md border border-[#b8b6c7] bg-gray-100 text-gray-500 px-3 py-2 text-sm outline-none cursor-not-allowed"
        />
      </div>

      {/* STATUS MESSAGES */}
      {formik.status?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {formik.status.error}
        </div>
      )}

      {formik.status?.success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
          {formik.status.success}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full rounded-md bg-[#080036] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1a1157] disabled:bg-[#908ca9] disabled:cursor-not-allowed"
      >
        {formik.isSubmitting ? "Envoi..." : "Créer le produit"}
      </button>
    </form>
  );
}
