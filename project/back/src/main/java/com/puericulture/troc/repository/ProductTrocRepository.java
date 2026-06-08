package com.puericulture.troc.repository;

import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductTrocRepository extends JpaRepository<ProductTroc, Long> {
    List<ProductTroc> findByStatus(ProductTrocStatus status);
}
