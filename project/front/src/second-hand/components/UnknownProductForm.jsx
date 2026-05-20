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

const UnknownProductForm = ({ ean, onSubmitSuccess }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      price: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Le nom du produit est requis"),

      category: Yup.string().required("La catégorie est requise"),

      price: Yup.number()
        .typeError("Le prix doit être un nombre")
        .required("Le prix est requis")
        .min(0.01, "Le prix doit être supérieur ou égal à 0.01"),
    }),

    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      setStatus(null);

      try {
        const payload = {
          ean,
          name: values.name,
          category: values.category,
          price: Number(values.price),
        };

        const response = await fetch("/api/v1/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.status === 201) {
          setStatus({ success: "Produit créé avec succès !" });
          if (onSubmitSuccess) onSubmitSuccess();
        } else {
          setStatus({
            error: "Une erreur est survenue lors de la création du produit.",
          });
        }
      } catch {
        setStatus({
          error: "Une erreur est survenue lors de la création du produit.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* NAME */}
      <div>
        <label htmlFor="name">Nom du produit</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="border p-2 w-full"
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        )}
      </div>

      {/* CATEGORY */}
      <div>
        <label htmlFor="category">Catégorie</label>
        <select
          id="category"
          name="category"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.category}
          className="border p-2 w-full"
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {formik.touched.category && formik.errors.category && (
          <div className="text-red-500 text-sm">{formik.errors.category}</div>
        )}
      </div>

      {/* PRICE */}
      <div>
        <label htmlFor="price">Prix estimé neuf (€)</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.price}
          className="border p-2 w-full"
        />

        {formik.touched.price && formik.errors.price && (
          <div className="text-red-500 text-sm">{formik.errors.price}</div>
        )}
      </div>

      {/* EAN */}
      <div>
        <label htmlFor="ean">EAN</label>
        <input
          id="ean"
          name="ean"
          type="text"
          value={ean}
          readOnly
          className="border p-2 w-full bg-gray-100"
        />
      </div>

      {/* STATUS */}
      {formik.status?.error && (
        <div className="text-red-500 text-sm">{formik.status.error}</div>
      )}

      {formik.status?.success && (
        <div className="text-green-500 text-sm">{formik.status.success}</div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={formik.isSubmitting || !formik.isValid}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {formik.isSubmitting ? "Envoi en cours..." : "Créer le produit"}
      </button>
    </form>
  );
};

export default UnknownProductForm;
