package com.puericulture.leasing.repository;

import com.puericulture.leasing.dto.LeasingProductSummary;
import com.puericulture.leasing.entity.LeasingArticle;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LeasingProductRepository extends JpaRepository<LeasingArticle, Long> {

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
                    p.condition,
                    'Location'          AS "badgeLabel",
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
                    WHERE product_id = p.id ORDER BY image_position ASC LIMIT 1
                ) pi_first ON true
                ORDER BY p.id DESC
                """,
            nativeQuery = true)
    List<LeasingProductSummary> findAllWithAvailability();

    @Query(
            value =
                    """
                SELECT p.id, p.post_title AS "postTitle", p.category, p.city,
                    pl.price_per_day AS "pricePerDay", pl.price_per_month AS "pricePerMonth",
                    p.condition, 'Location' AS "badgeLabel", pi_first.image_url AS "firstImageUrl",
                    CASE WHEN EXISTS (
                        SELECT 1 FROM public.client_products cp
                        JOIN public.leasing_orders lo ON lo.client_product_id = cp.id
                        WHERE cp.product_id = p.id
                          AND lo.start_date <= CURRENT_DATE AND lo.end_date >= CURRENT_DATE
                    ) THEN false ELSE true END AS "available"
                FROM public.products p
                INNER JOIN public.product_leasing pl ON pl.product_id = p.id
                LEFT JOIN LATERAL (
                    SELECT image_url FROM public.product_images
                    WHERE product_id = p.id ORDER BY image_position ASC LIMIT 1
                ) pi_first ON true
                WHERE LOWER(p.city) = LOWER(:city)
                ORDER BY p.id DESC
                """,
            nativeQuery = true)
    List<LeasingProductSummary> findByCityWithAvailability(@Param("city") String city);

    @Query(
            value =
                    """
                SELECT p.id, p.post_title AS "postTitle", p.category, p.city,
                    pl.price_per_day AS "pricePerDay", pl.price_per_month AS "pricePerMonth",
                    p.condition, 'Location' AS "badgeLabel", pi_first.image_url AS "firstImageUrl", true AS "available"
                FROM public.products p
                INNER JOIN public.product_leasing pl ON pl.product_id = p.id
                LEFT JOIN LATERAL (
                    SELECT image_url FROM public.product_images
                    WHERE product_id = p.id ORDER BY image_position ASC LIMIT 1
                ) pi_first ON true
                WHERE NOT EXISTS (
                    SELECT 1 FROM public.client_products cp
                    JOIN public.leasing_orders lo ON lo.client_product_id = cp.id
                    WHERE cp.product_id = p.id
                      AND lo.start_date <= :endDate AND lo.end_date >= :startDate
                )
                ORDER BY p.id DESC
                """,
            nativeQuery = true)
    List<LeasingProductSummary> findAvailableByDateRange(
            @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query(
            value =
                    """
                SELECT p.id, p.post_title AS "postTitle", p.category, p.city,
                    pl.price_per_day AS "pricePerDay", pl.price_per_month AS "pricePerMonth",
                    p.condition, 'Location' AS "badgeLabel", pi_first.image_url AS "firstImageUrl", true AS "available"
                FROM public.products p
                INNER JOIN public.product_leasing pl ON pl.product_id = p.id
                LEFT JOIN LATERAL (
                    SELECT image_url FROM public.product_images
                    WHERE product_id = p.id ORDER BY image_position ASC LIMIT 1
                ) pi_first ON true
                WHERE LOWER(p.city) = LOWER(:city)
                  AND NOT EXISTS (
                    SELECT 1 FROM public.client_products cp
                    JOIN public.leasing_orders lo ON lo.client_product_id = cp.id
                    WHERE cp.product_id = p.id
                      AND lo.start_date <= :endDate AND lo.end_date >= :startDate
                )
                ORDER BY p.id DESC
                """,
            nativeQuery = true)
    List<LeasingProductSummary> findByCityAndAvailableByDateRange(
            @Param("city") String city,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query(
            value =
                    "SELECT DISTINCT p.city FROM public.products p "
                            + "INNER JOIN public.product_leasing pl ON pl.product_id = p.id "
                            + "ORDER BY p.city ASC",
            nativeQuery = true)
    List<String> findAllAvailableCities();
}
