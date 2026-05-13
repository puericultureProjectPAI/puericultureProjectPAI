package com.puericulture.leasing.repository;

import com.puericulture.leasing.entity.LeasingProduct;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LeasingProductRepository extends JpaRepository<LeasingProduct, Long> {

    @Query(
            value =
                    """
                SELECT
                    p.id,
                    p.post_title        AS "postTitle",
                    p.category,
                    p.city,
                    pl.price_per_day    AS "pricePerDay",
                    pl.price_per_month  AS "pricePerMonth",
                    pl.condition,
                    pi_first.image_url  AS "firstImageUrl",
                    CASE
                        WHEN EXISTS (
                            SELECT 1 FROM public.client_products cp
                            JOIN public.leasing_orders lo ON lo.client_product_id = cp.id
                            WHERE cp.product_id = p.id
                              AND lo.start_date <= CURRENT_DATE
                              AND lo.end_date   >= CURRENT_DATE
                        ) THEN false
                        ELSE true
                    END AS "available"
                FROM public.products p
                INNER JOIN public.product_leasing pl ON pl.product_id = p.id
                LEFT JOIN LATERAL (
                    SELECT image_url FROM public.product_images
                    WHERE product_id = p.id ORDER BY position ASC LIMIT 1
                ) pi_first ON true
                ORDER BY p.id DESC
                """,
            nativeQuery = true)
    List<LeasingProductSummary> findAllWithAvailability();
}
