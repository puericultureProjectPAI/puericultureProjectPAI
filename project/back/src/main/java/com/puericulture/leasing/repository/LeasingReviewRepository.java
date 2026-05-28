package com.puericulture.leasing.repository;

import com.puericulture.leasing.dto.LeasingReviewSummary;
import com.puericulture.leasing.entity.LeasingReview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * STRATEGIC INTENT: Manages DB operations for the leasing_reviews table. WHY THIS MATTERS: Provides
 * quick checks for order review duplicates (existsByLeasingOrderId) and uses a high-performance
 * native JOIN query to aggregate reviewer name, rating, comment, and date into a clean read model
 * for the frontend detail page.
 */
@Repository
public interface LeasingReviewRepository extends JpaRepository<LeasingReview, Long> {

    /**
     * Checks if a review has already been submitted for a given leasing order. Used by the service
     * layer to prevent duplicate submissions (one review per completed rental).
     */
    boolean existsByLeasingOrderId(Long leasingOrderId);

    /**
     * Fetches all reviews associated with a leased product, resolving the reviewer's display name
     * by JOINing leasing_reviews → leasing_orders → client_products → person.
     */
    @Query(
            value =
                    """
                SELECT
                    p.name           AS "reviewerName",
                    lr.rating,
                    lr.review_date   AS "reviewDate",
                    lr.comment
                FROM public.leasing_reviews lr
                INNER JOIN public.leasing_orders lo   ON lo.client_product_id = lr.leasing_order_id
                INNER JOIN public.client_products cp  ON cp.id = lo.client_product_id
                INNER JOIN public.person p            ON p.id = cp.client_id
                WHERE lr.leasing_id = :leasingId
                ORDER BY lr.review_date DESC
                """,
            nativeQuery = true)
    List<LeasingReviewSummary> findAllByLeasingId(@Param("leasingId") Long leasingId);

    /**
     * Verifies if a leasing order exists, belongs to the specified person, and is for the specified
     * product. This acts as an API security guard before letting a client write a review.
     */
    @Query(
            value =
                    """
                SELECT EXISTS (
                    SELECT 1 FROM public.leasing_orders lo
                    INNER JOIN public.client_products cp ON cp.id = lo.client_product_id
                    WHERE lo.client_product_id = :leasingOrderId
                      AND cp.client_id = CAST(:clientId AS uuid)
                      AND cp.product_id = :leasingId
                )
                """,
            nativeQuery = true)
    boolean isOrderEligibleForReview(
            @Param("leasingOrderId") Long leasingOrderId,
            @Param("clientId") String clientId,
            @Param("leasingId") Long leasingId);

    /**
     * Retrieves an existing review for a specific leasing order. Used to support review
     * editing/modification (upsert logic).
     */
    Optional<LeasingReview> findByLeasingOrderId(Long leasingOrderId);
}
