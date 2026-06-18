import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useImageManager } from "../../common/hooks/useImageManager";
import { useReportManager } from "../hooks/useReportManager";

const REPORT_TYPES = [
  { value: "ARTICLE_NON_CONFORME", label: "Article non conforme" },
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
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const { uploadImage, isUploading, error: uploadError } = useImageManager();
  const {
    createReport,
    loading: isSubmittingReport,
    error: submitError,
  } = useReportManager();

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
    try {
      await createReport(exchangeId, {
        type: values.type,
        description: values.description,
        attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : null,
      });
      onSuccess();
    } catch {
      // error already stored in submitError from useReportManager
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClassName =
    "w-full rounded-md border border-[#858199] bg-white px-3 py-[9px] text-[14px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]";

  const labelClassName =
    "mb-[7px] block text-[16px] font-extrabold leading-tight text-[#080036]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-figtree">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] p-5">
          <h2 className="text-[20px] font-extrabold text-[#080036]">
            Signaler un problème
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-[#555261] hover:text-[#080036] text-xl leading-none"
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
            <Form className="space-y-4 p-5">
              {submitError && (
                <div className="rounded-md border border-red-300 bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                  {submitError}
                </div>
              )}

              <div>
                <label htmlFor="type" className={labelClassName}>
                  Type de problème *
                </label>

                <Field
                  as="select"
                  id="type"
                  name="type"
                  className={fieldClassName}
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
                  className="mt-1 text-[12px] text-red-600"
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClassName}>
                  Description *
                </label>

                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Décrivez le problème rencontré..."
                  className={`${fieldClassName} min-h-[100px] resize-none`}
                />

                <ErrorMessage
                  name="description"
                  component="p"
                  className="mt-1 text-[12px] text-red-600"
                />
              </div>

              <div>
                <p className={labelClassName}>Pièces jointes (optionnel)</p>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#858199] px-4 py-3 text-[14px] font-bold text-[#2f2d3c] transition-colors hover:bg-[#f7f7fa]">
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
                  <p className="mt-1 text-[12px] text-red-600">{uploadError}</p>
                )}

                {attachmentUrls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {attachmentUrls.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`Pièce jointe ${i + 1}`}
                          className="h-16 w-16 rounded-xl border border-[#858199] object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          aria-label={`Supprimer la pièce jointe ${i + 1}`}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#858199] px-5 py-3 text-[14px] font-bold text-[#2f2d3c] transition-colors hover:bg-[#f7f7fa]"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmittingReport || isUploading}
                  className="rounded-xl bg-[#3A51C9] px-5 py-3 text-[14px] font-bold text-white shadow-md transition-all hover:bg-[#3145ad] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {isSubmitting || isSubmittingReport
                    ? "Envoi..."
                    : "Soumettre le signalement"}
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
