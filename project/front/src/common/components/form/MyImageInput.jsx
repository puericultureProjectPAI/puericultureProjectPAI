import { useField, useFormikContext } from "formik";
import { useState } from "react";
import { useProductImage } from "../../hooks/useProductImage";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const DEFAULT_MAX = 5;

/**
 * Champ Formik pour l'upload d'images vers Cloudinary.
 *
 * Valeur Formik : string[] d'URLs uploadées.
 *
 * Props :
 *  - name        (requis) Nom du champ Formik
 *  - label       Libellé affiché
 *  - maxImages   Nombre max d'images (défaut 5)
 *  - productId   Si fourni, sauvegarde l'URL en base dès l'upload
 */
export default function MyImageInput({
  label,
  maxImages = DEFAULT_MAX,
  productId,
  ...props
}) {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const { uploadImage, isUploading, error: uploadError } = useProductImage();

  const [limitWarning, setLimitWarning] = useState(false);
  const urls = Array.isArray(field.value) ? field.value : [];

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files);
    e.target.value = "";

    const remaining = maxImages - urls.length;
    if (remaining <= 0) {
      setLimitWarning(true);
      return;
    }

    const eligible = selected.filter((f) => ALLOWED_TYPES.includes(f.type));
    const toUpload = eligible.slice(0, remaining);

    if (eligible.length > remaining) {
      setLimitWarning(true);
    } else {
      setLimitWarning(false);
    }

    const newUrls = [];
    for (const file of toUpload) {
      const url = await uploadImage(file, productId);
      if (url) newUrls.push(url);
    }

    setFieldValue(field.name, [...urls, ...newUrls]);
  };

  const removeImage = (index) => {
    setFieldValue(
      field.name,
      urls.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="mt-0">
      {label && (
        <p className="mb-2 text-sm font-semibold text-[#080036]">
          {label} ({urls.length}/{maxImages})
        </p>
      )}

      {(uploadError || (meta.touched && meta.error)) && (
        <p className="mb-2 text-xs font-semibold text-red-500">
          {uploadError || meta.error}
        </p>
      )}

      {limitWarning && (
        <p className="mb-2 text-xs font-semibold text-orange-500">
          Maximum {maxImages} photos autorisées. Seules les premières ont été
          ajoutées.
        </p>
      )}

      <div className="flex min-h-[80px] w-full flex-wrap items-center gap-2 rounded-xl border border-[#858199] bg-[#f7f7ff] px-4 py-2">
        {urls.map((url, i) => (
          <div key={url} className="relative h-[64px] w-[64px]">
            <img
              src={url}
              alt={`aperçu ${i + 1}`}
              className="h-full w-full rounded-lg border border-[#d5d2df] object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
            >
              ×
            </button>
          </div>
        ))}

        {isUploading && (
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-lg border-2 border-dashed border-[#858199] bg-white">
            <span className="text-sm font-extrabold text-[#7c788c]">...</span>
          </div>
        )}

        {!isUploading && urls.length < maxImages && (
          <label className="flex h-[64px] w-[64px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#383545] bg-white transition hover:border-[#080036]">
            <span className="text-[20px] font-medium leading-none text-[#777388]">
              +
            </span>
            <span className="mt-2 text-[16px] font-extrabold leading-none text-[#777388]">
              Ajouter
            </span>
            <input
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
