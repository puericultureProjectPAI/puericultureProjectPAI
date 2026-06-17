import { useState } from "react";
import { apiClient } from "../utils/apiClient";
import { optimizeImage } from "../utils/imageOptimizer";

export const useImageManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const isLocalMock = !cloudName || !uploadPreset;
  const uploadUrl = isLocalMock
    ? `http://localhost:8081/v1_1/local_mock/image/upload`
    : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  /**
   * Uploads an image to Cloudinary (or the local mock) after optimizing it.
   * @param {File} rawFile - The raw file from an <input type="file">.
   * @returns {Promise<string|null>} The secure URL of the uploaded image, or null on failure.
   */
  const uploadImage = async (rawFile) => {
    setIsUploading(true);
    setError(null);

    try {
      const optimizedFile = await optimizeImage(rawFile);

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`Upload failed (Status: ${response.status})`);

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Deletes an image by delegating to the Spring backend.
   *
   * The backend (DELETE /api/common/images?url=...) is the only party
   * that holds the Cloudinary API_SECRET and is therefore the only one
   * allowed to perform the actual deletion.
   *
   * In local mock mode the call is skipped and success is simulated.
   *
   * @param {string} imageUrl - The full Cloudinary URL to delete.
   * @returns {Promise<boolean>} true on success, false on failure.
   */
  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return false;

    // Local mock: skip the network call and simulate success
    if (
      isLocalMock ||
      imageUrl.includes("localhost:") ||
      imageUrl.includes("mock-uploads")
    ) {
      console.log(`[MOCK] Simulated deletion for local image: ${imageUrl}`);
      return true;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // apiClient already injects the Supabase Bearer token (see apiClient.jsx)
      await apiClient.delete("/common/images", {
        params: { url: imageUrl },
      });
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message ?? err.message ?? "Deletion failed.";
      setError(message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
    isDeleting,
    error,
    isLocalMock,
  };
};
