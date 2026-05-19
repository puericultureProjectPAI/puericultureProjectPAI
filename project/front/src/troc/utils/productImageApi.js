import { apiClient } from "../../common/utils/apiClient";

export async function uploadProductImages(productId, files) {
  return Promise.all(
    files.map((file) => {
      const form = new FormData();
      form.append("file", file);
      form.append("productId", productId);
      return apiClient.post("/api/troc/images/upload", form);
    }),
  );
}
