import { useQuery, useQueries } from "@tanstack/react-query";
import { apiClient } from "../utils/apiClient";

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const res = await apiClient.get(
        "/public/catalog/products/recommendations",
      );
      return res.data;
    },
  });
};

export const useQuartersProducts = (quartersData) => {
  return useQueries({
    queries: quartersData.map((q) => ({
      queryKey: ["productsByAge", q.min, q.max],
      queryFn: async () => {
        const res = await apiClient.get(
          `/public/catalog/products/by-age?minAge=${q.min}&maxAge=${q.max}`,
        );
        return { ...q, products: res.data };
      },
    })),
  });
};
