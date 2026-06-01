package com.puericulture.troc.repository;

import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductTrocRepository extends JpaRepository<ProductTroc, Long> {

    @Query(
            """
        SELECT p
        FROM ProductTroc p
        WHERE p.author.id = :authorId
          AND p.status = :status
    """)
    List<ProductTroc> findAvailableProductsByAuthor(
            @Param("authorId") UUID authorId, @Param("status") ProductTrocStatus status);

    @Query(
            """
        SELECT p
        FROM ProductTroc p
        WHERE p.author.id <> :authorId
          AND p.status = :status
    """)
    List<ProductTroc> findAvailableProductsNotOwnedByAuthor(
            @Param("authorId") UUID authorId, @Param("status") ProductTrocStatus status);
}
