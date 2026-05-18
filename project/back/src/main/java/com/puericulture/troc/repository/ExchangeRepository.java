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

    List<Exchange> findByProposerProductAuthorId(UUID authorId);

    List<Exchange> findByReceiverProductAuthorId(UUID authorId);

    List<Exchange> findByReceiverProduct(ProductTroc product);

    Optional<Exchange> findByReceiverProductIdAndProposerProductAuthorId(
            Long receiverProductId, UUID proposerAuthorId);

    @Query(
            """
        SELECT e
        FROM Exchange e
        WHERE
            e.status = :status
            AND e.id <> :exchangeId
            AND (
                e.proposerProduct.id = :proposerProductId
                OR e.receiverProduct.id = :receiverProductId
                OR e.proposerProduct.id = :receiverProductId
                OR e.receiverProduct.id = :proposerProductId
            )
    """) // request to find all pending exchanges that involve either the proposer or receiver product, excluding the current exchange
    List<Exchange> findConflictingPendingExchanges(
            @Param("status") ExchangeStatus status,
            @Param("exchangeId") Long exchangeId,
            @Param("proposerProductId") Long proposerProductId,
            @Param("receiverProductId") Long receiverProductId);

    @Query(
            """
        SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END
        FROM Exchange e
        WHERE
            (
                e.proposerProduct.id = :productId
                OR e.receiverProduct.id = :productId
            )
            AND e.status IN :statuses
    """) // request to check if there are any exchanges involving the given product that are in any of the specified statuses
    boolean existsByProductAndStatuses(
            @Param("productId") Long productId, @Param("statuses") List<ExchangeStatus> statuses);
}
