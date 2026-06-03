import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../common/utils/apiClient";

/**
 * Hook to retrieve a detailed leasing article by its ID.
 * Backend: GET /public/leasing/articles/{id} (Public endpoint)
 */
export function useLeasingArticle(id) {
  return useQuery({
    queryKey: ["leasingArticle", id],
    queryFn: async () => {
      const response = await apiClient.get(`/public/leasing/articles/${id}`);
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

/**
 * Hook to submit a new leasing reservation.
 * Backend: POST /leasing/reservations (JWT protected via apiClient interceptor)
 */
export function useSubmitBooking(leasingId) {
  return useMutation({
    mutationFn: async ({
      startDate,
      endDate,
      deliveryStreet,
      deliveryZipCode,
      deliveryCity,
    }) => {
      const response = await apiClient.post("/leasing/reservations", {
        productId: Number(leasingId),
        startDate,
        endDate,
        deliveryStreet,
        deliveryZipCode,
        deliveryCity,
      });
      return response.data;
    },
  });
}

/**
 * Hook to retrieve user profile address for leasing delivery.
 * Backend: GET /leasing/profile (JWT protected via apiClient interceptor)
 */
export function useLeasingProfile() {
  return useQuery({
    queryKey: ["leasingProfile"],
    queryFn: async () => {
      const response = await apiClient.get("/leasing/profile");
      return response.data;
    },
  });
}

/**
 * Custom UI hook to encapsulate state mapping, name/date formatting logic
 * and calculations for childcare leasing reviews.
 */
export function useLeasingReviewsData(leasingId) {
  const { data: responseData, isLoading, error } = useLeasingReviews(leasingId);

  const formatTimeAgo = (reviewDate) => {
    if (!reviewDate) return "Récemment";
    const date = new Date(reviewDate);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Aujourd'hui";
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
    }
    const months = Math.floor(diffDays / 30);
    return `Il y a ${months} mois`;
  };

  const reviews = (responseData?.reviews || []).map((r) => ({
    reviewerName: r.reviewerName,
    rating: r.rating,
    comment: r.comment || "Aucun commentaire.",
    reviewDate: r.reviewDate,
    timeAgo: formatTimeAgo(r.reviewDate),
  }));

  return {
    reviews,
    averageRating:
      responseData?.averageRating != null
        ? responseData.averageRating.toFixed(1)
        : null,
    totalReviews: responseData?.totalReviews || 0,
    isLoading,
    error,
  };
}

export function useEligibleOrderId(leasingId, enabled = true) {
  return useQuery({
    queryKey: ["eligibleOrderId", leasingId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/leasing/products/${leasingId}/eligible-order`,
      );
      return response.data;
    },
    enabled: !!leasingId && enabled,
  });
}
