import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useImageManager } from "../../common/hooks/useImageManager";
import * as reportApi from "../utils/reportApi";

const REPORT_TYPES = [
  { value: "ARTICLE_NON_CONFORME", label: "Article non conforme" },
  { value: "ARTICLE_NON_RECU", label: "Article non reçu" },
  { value: "ARTICLE_ENDOMMAGE", label: "Article endommagé" },
  { value: "DESACCORD_ECHANGE", label: "Désaccord sur l'échange" },
  { value: "COMPORTEMENT_INAPPROPRIE", label: "Comportement inapproprié" },
  { value: "FRAUDE_SUSPECTEE", label: "Fraude suspectée" },
  { value: "ANNULATION_ABUSIVE", label: "Annulation abusive" },
  { value: "AUTRE", label: "Autre" },
];

const validationSchema = Yup.object({
  type: Yup.string().required("Veuillez sélectionner un type de signalement"),
  description: Yup.string()
    .min(10, "La description doit comporter au moins 10 caractères")
    .required("La description est obligatoire"),
});

const ReportFormModal = ({ exchangeId, onClose, onSuccess }) => {
  const [submitError, setSubmitError] = useState(null);
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const { uploadImage, isUploading, error: uploadError } = useImageManager();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const url = await uploadImage(file);
    if (url) {
      setAttachmentUrls((prev) => [...prev, url]);
    }
  };

  const removeAttachment = (index) => {
    setAttachmentUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError(null);
    try {
      await reportApi.createReport(exchangeId, {
        type: values.type,
        description: values.description,
        attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : null,
      });
      onSuccess();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Impossible de soumettre le signalement. Veuillez réessayer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold text-gray-900">
            Signaler un problème
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={{ type: "", description: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 p-4">
              {submitError && (
                <div className="rounded border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <div>
                <label
                  htmlFor="type"
                  className="mb-1 block text-sm font-semibold text-gray-700"
                >
                  Type de problème *
                </label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">Sélectionnez un type...</option>
                  {REPORT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="type"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-semibold text-gray-700"
                >
                  Description *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Décrivez le problème rencontré..."
                  className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              <div>
                <p className="mb-1 text-sm font-semibold text-gray-700">
                  Pièces jointes (optionnel)
                </p>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-dashed border-gray-400 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  {isUploading ? "Envoi en cours..." : "+ Ajouter une image"}
                </label>
                {uploadError && (
                  <p className="mt-1 text-xs text-red-600">{uploadError}</p>
                )}
                {attachmentUrls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {attachmentUrls.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`Pièce jointe ${i + 1}`}
                          className="h-16 w-16 rounded border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? "Envoi..." : "Soumettre le signalement"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReportFormModal;
