package com.puericulture.troc.repository;

import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductTrocRepository extends JpaRepository<ProductTroc, Long> {
    List<ProductTroc> findByStatus(ProductTrocStatus status);

    // Find products authored by a specific user with given status
    List<ProductTroc> findByAuthorIdAndStatus(UUID authorId, ProductTrocStatus status);
}
