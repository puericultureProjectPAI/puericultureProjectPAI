package com.puericulture.troc.repository;

import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductTrocRepository extends JpaRepository<ProductTroc, Long> {
    List<ProductTroc> findByAuthorIdAndStatusAndEstimatedPriceBetween(
            UUID authorId, ProductTrocStatus status, Long minPrice, Long maxPrice);

    // Requête personnalisée pour trouver des produits d'un tiers qui pourraient compléter l'échange
    // triangulaire
    @Query(
            "SELECT p FROM ProductTroc p WHERE p.author.id NOT IN (:requesterId, :userBId) "
                    + "AND p.status = :status "
                    + "AND p.estimatedPrice BETWEEN :minPrice AND :maxPrice")
    List<ProductTroc> findThirdPartyProductsForTriangle(
            @Param("requesterId") UUID requesterId,
            @Param("userBId") UUID userBId,
            @Param("status") ProductTrocStatus status,
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice);
}
