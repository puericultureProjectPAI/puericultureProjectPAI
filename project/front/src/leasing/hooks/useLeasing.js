import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../common/utils/apiClient";

/**
 * Hook to retrieve a detailed leasing article by its ID.
 * Backend: GET /leasing/articles/{id} (JWT protected via apiClient interceptor)
 */
export function useLeasingArticle(id) {
  return useQuery({
    queryKey: ["leasingArticle", id],
    queryFn: async () => {
      const response = await apiClient.get(`/leasing/articles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook to retrieve all public reviews left for a leasing product.
 * Backend: GET /public/leasing/products/{leasingId}/reviews (Public endpoint)
 */
export function useLeasingReviews(leasingId) {
  return useQuery({
    queryKey: ["leasingReviews", leasingId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/public/leasing/products/${leasingId}/reviews`,
      );
      return response.data;
    },
    enabled: !!leasingId,
  });
}

/**
 * Hook to submit a new review (or edit/upsert an existing one) for a leasing product.
 * Backend: POST /leasing/products/{leasingId}/reviews (JWT protected via apiClient interceptor)
 */
export function useSubmitReview(leasingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leasingOrderId, rating, comment }) => {
      const response = await apiClient.post(
        `/leasing/products/${leasingId}/reviews`,
        {
          leasingOrderId,
          rating,
          comment,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the cache for this product's reviews to trigger an automatic re-fetch
      queryClient.invalidateQueries({
        queryKey: ["leasingReviews", leasingId],
      });
    },
  });
}
