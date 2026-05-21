import { apiClient } from "./apiClient";
import { optimizeImage } from "./imageOptimizer";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const isLocalMock = !cloudName || !uploadPreset;
const CLOUDINARY_UPLOAD_URL = isLocalMock
  ? "http://localhost:8081/v1_1/local_mock/image/upload"
  : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

/**
 * Optimizes a raw file then uploads it to Cloudinary (or local mock).
 * @param {File} rawFile
 * @returns {Promise<string>} The secure_url of the stored image.
 */
export async function uploadImageToCloudinary(rawFile) {
  const optimizedFile = await optimizeImage(rawFile);

  const formData = new FormData();
  formData.append("file", optimizedFile);
  if (!isLocalMock) {
    formData.append("upload_preset", uploadPreset);
  }

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload Cloudinary échoué (status: ${response.status})`);
  }

  const data = await response.json();
  return data.secure_url;
}

export async function getProductImages(productId) {
  return apiClient.get(`/api/common/product/images/product/${productId}`);
}

export async function addProductImage(productId, imageUrl) {
  return apiClient.post("/api/common/product/images", null, {
    params: { imageUrl, productId },
  });
}

export async function addProductImages(productId, imageUrls) {
  return Promise.all(imageUrls.map((url) => addProductImage(productId, url)));
}
