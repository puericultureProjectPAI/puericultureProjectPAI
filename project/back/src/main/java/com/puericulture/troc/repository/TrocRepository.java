package com.puericulture.troc.repository;

import com.puericulture.troc.entity.Troc;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TrocRepository extends JpaRepository<Troc, Long> {

    @Query(
            value = """
                    SELECT p.id AS "productId",
                           p.post_title AS title,
                           p.description AS description,
                           COALESCE(img.image_url, '') AS "imageUrl",
                           p.category AS category,
                           t.estimated_price AS "estimatedPrice"
                    FROM public.product_troc t
                    JOIN public.products p ON p.id = t.product_id
                    LEFT JOIN public.product_images img
                           ON img.product_id = p.id
                          AND img.position = 0
                    WHERE p.category = 'TROC'
                    ORDER BY p.id DESC
                    """,
            nativeQuery = true)
    List<TrocProjection> findAllTrocProducts();

    @Query(
            value = """
                    SELECT p.id AS "productId",
                           p.post_title AS title,
                           p.description AS description,
                           COALESCE(img.image_url, '') AS "imageUrl",
                           p.category AS category,
                           t.estimated_price AS "estimatedPrice"
                    FROM public.product_troc t
                    JOIN public.products p ON p.id = t.product_id
                    LEFT JOIN public.product_images img
                           ON img.product_id = p.id
                          AND img.position = 0
                    WHERE p.id = :productId
                    """,
            nativeQuery = true)
    Optional<TrocProjection> findTrocProductByProductId(@Param("productId") Long productId);
}
