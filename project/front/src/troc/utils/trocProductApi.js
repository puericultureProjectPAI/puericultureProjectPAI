import { apiClient } from "../../common/utils/apiClient";

export async function createTrocProduct(data) {
  return apiClient.post("/api/troc/products", data);
}

export async function getTrocProduct(id) {
  return apiClient.get(`/api/troc/products/${id}`);
}
