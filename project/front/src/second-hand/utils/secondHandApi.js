import { apiClient } from "../../common/utils/apiClient";

export async function createSecondHand(payload) {
  const response = await apiClient.post("/second-hand", payload);
  return response.data;
}

export async function getProduct(ean) {
  const response = await apiClient.get(`api/v1/products/${ean}`);
  return response.data;
}

export async function getPriceComparison(ean) {
  const response = await apiClient.get(
    `api/v1/products/${ean}/price-comparison`,
  );
  return response.data;
}
export const getSecondHandProducts = async () => {
  const response = await apiClient.get(`/public/second-hand/products`);

  return response.data;
};
