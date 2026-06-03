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
    <div className="mt-4">
      {label && (
        <p className="text-sm font-medium text-gray-700 mb-1">
          {label} ({urls.length}/{maxImages})
        </p>
      )}

      {(uploadError || (meta.touched && meta.error)) && (
        <p className="text-red-500 text-sm mb-2">{uploadError || meta.error}</p>
      )}

      {limitWarning && (
        <p className="text-orange-500 text-sm mb-2">
          Maximum {maxImages} photos autorisées. Seules les premières ont été
          ajoutées.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <div key={url} className="relative w-20 h-20">
            <img
              src={url}
              alt={`aperçu ${i + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {isUploading && (
          <div className="w-20 h-20 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50">
            <span className="text-xs text-blue-400">...</span>
          </div>
        )}

        {!isUploading && urls.length < maxImages && (
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
            <span className="text-2xl text-gray-400">+</span>
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
