import { apiClient } from "./apiClient";

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

export async function deleteProductImage(imageId) {
  return apiClient.delete(`/api/common/product/images/${imageId}`);
}
