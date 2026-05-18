// ExchangeRepository.java

package com.puericulture.troc.repository;

import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.ProductTroc;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    boolean existsByProposerProductAndReceiverProduct(
            ProductTroc proposerProduct, ProductTroc receiverProduct);

    List<Exchange> findByReceiverProduct(ProductTroc receiverProduct);

    List<Exchange> findByProposerProduct(ProductTroc proposerProduct);

    List<Exchange> findByProposerProductAuthorId(UUID mockUserId);

    List<Exchange> findByReceiverProductAuthorId(UUID authorId);

    Optional<Exchange> findByReceiverProductIdAndProposerProductAuthorId(
            Long receiverProductId, UUID proposerAuthorId);

    @Query(
            """
        SELECT e
        FROM Exchange e
        WHERE e.status = :status
        AND e.id <> :exchangeId
        AND (
            e.proposerProduct.id = :product1Id
            OR e.receiverProduct.id = :product1Id
            OR e.proposerProduct.id = :product2Id
            OR e.receiverProduct.id = :product2Id
        )
    """) // This query finds all pending exchanges that involve either of the two products, excluding the current exchange.
    List<Exchange> findConflictingPendingExchanges(
            @Param("status") ExchangeStatus status,
            @Param("exchangeId") Long exchangeId,
            @Param("product1Id") Long product1Id,
            @Param("product2Id") Long product2Id);
}
