import { useState } from "react";
import { useImageManager } from "../hooks/useImageManager";

/**
 * Dev-only component for testing image upload and deletion end-to-end.
 * Remove (or guard behind a feature flag) before shipping to production.
 */
export default function ImageTester() {
  const {
    uploadImage,
    deleteImage,
    isUploading,
    isDeleting,
    error,
    isLocalMock,
  } = useImageManager();
  const [images, setImages] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      setImages((prev) => [...prev, uploadedUrl]);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleDelete = async (urlToRemove) => {
    // deleteImage now talks to the Spring backend — no more thrown errors here
    const success = await deleteImage(urlToRemove);
    if (success) {
      setImages((prev) => prev.filter((url) => url !== urlToRemove));
    }
    // If it failed, the `error` state from the hook is displayed below
  };

  const isBusy = isUploading || isDeleting;

  return (
    <div className="p-4 border rounded-lg max-w-md bg-white text-black shadow-sm">
      <h2 className="text-lg font-bold mb-4 border-b pb-2">
        Image Tester&nbsp;
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded ${isLocalMock ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
        >
          {isLocalMock ? "MOCK LOCAL" : "CLOUDINARY"}
        </span>
      </h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Upload an image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isBusy}
          className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      {isUploading && (
        <p className="text-blue-600 text-sm mb-2">Compressing and uploading…</p>
      )}
      {isDeleting && (
        <p className="text-orange-500 text-sm mb-2">Deleting image…</p>
      )}
      {error && <p className="text-red-600 text-sm mb-2">⚠️ {error}</p>}

      <div className="grid grid-cols-2 gap-4 mt-4">
        {images.map((url, idx) => (
          <div key={idx} className="relative group">
            <img
              src={url}
              alt={`Upload ${idx}`}
              className="w-full h-32 object-cover rounded-md"
            />
            <button
              onClick={() => handleDelete(url)}
              disabled={isDeleting}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
