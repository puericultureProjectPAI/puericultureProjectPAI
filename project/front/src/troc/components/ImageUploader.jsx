import { useState } from "react";
import { useImageManager } from "../../common/hooks/useImageManager";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGES = 5;

export default function ImageUploader({ onImagesChange }) {
  const [urls, setUrls] = useState([]);
  const [localError, setLocalError] = useState("");
  const {
    uploadImage,
    deleteImage,
    isUploading,
    error: uploadError,
  } = useImageManager();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setLocalError("");

    for (const file of files) {
      if (urls.length >= MAX_IMAGES) {
        setLocalError(`Maximum ${MAX_IMAGES} images par produit`);
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setLocalError(
          `Format non supporté : ${file.name}. Formats acceptés : JPEG, PNG, GIF, WEBP`,
        );
        continue;
      }

      const url = await uploadImage(file);
      if (url) {
        setUrls((prev) => {
          const updated = [...prev, url];
          onImagesChange?.(updated);
          return updated;
        });
      }
    }

    e.target.value = "";
  };

  const removeImage = async (url) => {
    await deleteImage(url);
    setUrls((prev) => {
      const updated = prev.filter((u) => u !== url);
      onImagesChange?.(updated);
      return updated;
    });
  };

  const error = localError || uploadError;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-1">
        Photos ({urls.length}/{MAX_IMAGES})
      </p>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {isUploading && (
        <p className="text-blue-500 text-sm mb-2">Upload en cours...</p>
      )}

      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <div key={i} className="relative w-20 h-20">
            <img
              src={url}
              alt={`aperçu ${i + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {urls.length < MAX_IMAGES && !isUploading && (
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
            <span className="text-2xl text-gray-400">+</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
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
