import { apiClient } from "../../common/utils/apiClient";

export async function createSecondHand(payload) {
  const response = await apiClient.post("/second-hand", payload);
  return response.data;
}
