import { apiClient } from "../../common/utils/apiClient";

export async function getProductImages(productId) {
  return apiClient.get(`/api/troc/images/product/${productId}`);
}

export async function addProductImage(productId, imageUrl) {
  return apiClient.post("/api/troc/images", null, {
    params: { imageUrl, productId },
  });
}

export async function addProductImages(productId, imageUrls) {
  return Promise.all(imageUrls.map((url) => addProductImage(productId, url)));
}
