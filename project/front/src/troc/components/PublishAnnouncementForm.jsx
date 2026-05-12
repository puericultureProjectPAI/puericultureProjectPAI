import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const initialValues = {
  title: "",
  description: "",
  imagesReferences: "",
  estimatedPrice: 0,
};

const validationSchema = Yup.object({
  title: Yup.string().required("Le titre est obligatoire"),
  description: Yup.string().required("La description est obligatoire"),
  estimatedPrice: Yup.number()
    .min(0, "Le prix estimé doit être positif")
    .required("Le prix estimé est obligatoire"),
});

export default function PublishAnnouncementForm({ onSubmit }) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        const payload = { ...values, estimatedPrice: Number(values.estimatedPrice) };
        const isCreated = await onSubmit(payload);
        if (isCreated) {
          helpers.resetForm();
        }
        helpers.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="title">
              Titre
            </label>
            <Field className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" id="title" name="title" placeholder="Ex : Poussette à échanger" />
            <ErrorMessage className="mt-1 block text-sm text-red-600" component="span" name="title" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="description">
              Description
            </label>
            <Field as="textarea" className="min-h-28 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" id="description" name="description" placeholder="Décrivez l’article et son état général" />
            <ErrorMessage className="mt-1 block text-sm text-red-600" component="span" name="description" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="estimatedPrice">
              Prix estimé
            </label>
            <Field className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" id="estimatedPrice" min="0" name="estimatedPrice" type="number" />
            <ErrorMessage className="mt-1 block text-sm text-red-600" component="span" name="estimatedPrice" />
          </div>

          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="imagesReferences">
              Référence image optionnelle
            </label>
            <Field className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" id="imagesReferences" name="imagesReferences" placeholder="URL ou référence d’image" />
          </div>

          <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Publication..." : "Publier l’annonce"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
