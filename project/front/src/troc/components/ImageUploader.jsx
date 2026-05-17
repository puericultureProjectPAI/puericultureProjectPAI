import { useState } from "react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGES = 5;

export default function ImageUploader({ onImagesChange }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setError("");

    const newImages = [];
    for (const file of files) {
      if (images.length + newImages.length >= MAX_IMAGES) {
        setError(`Maximum ${MAX_IMAGES} images par produit`);
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(
          `Format non supporté : ${file.name}. Formats acceptés : JPEG, PNG, GIF, WEBP`,
        );
        continue;
      }
      newImages.push({ file, preview: URL.createObjectURL(file) });
    }

    const updated = [...images, ...newImages];
    setImages(updated);
    onImagesChange?.(updated.map((i) => i.file));
    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange?.(updated.map((i) => i.file));
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-1">
        Photos ({images.length}/{MAX_IMAGES})
      </p>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20">
            <img
              src={img.preview}
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

        {images.length < MAX_IMAGES && (
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
