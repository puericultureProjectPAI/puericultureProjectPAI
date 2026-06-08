import { apiClient } from "../../common/utils/apiClient";

export async function createTroc(payload) {
  const response = await apiClient.post("/troc", payload);
  return response.data;
}

export async function getProducts() {
  const response = await apiClient.get("/troc/products");
  return response.data;
}
