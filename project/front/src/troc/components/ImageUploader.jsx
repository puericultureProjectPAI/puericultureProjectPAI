import { useState } from "react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGES = 5;

export default function ImageUploader({ onImagesChange }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [localError, setLocalError] = useState("");

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setLocalError("");

    if (files.length + selected.length > MAX_IMAGES) {
      setLocalError(
        `Maximum ${MAX_IMAGES} images par produit. Veuillez sélectionner moins de photos.`,
      );
      e.target.value = "";
      return;
    }

    const validFiles = [];
    const validPreviews = [];
    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setLocalError(
          `Format non supporté : ${file.name}. Formats acceptés : JPEG, PNG, GIF, WEBP`,
        );
        continue;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    const newFiles = [...files, ...validFiles];
    const newPreviews = [...previews, ...validPreviews];
    setFiles(newFiles);
    setPreviews(newPreviews);
    onImagesChange?.(newFiles);
    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onImagesChange?.(newFiles);
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-1">
        Photos ({files.length}/{MAX_IMAGES})
      </p>

      {localError && <p className="text-red-500 text-sm mb-2">{localError}</p>}

      <div className="flex flex-wrap gap-2">
        {previews.map((preview, i) => (
          <div key={i} className="relative w-20 h-20">
            <img
              src={preview}
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

        {files.length < MAX_IMAGES && (
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
