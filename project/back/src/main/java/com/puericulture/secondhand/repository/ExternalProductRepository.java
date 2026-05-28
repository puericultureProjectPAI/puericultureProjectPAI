package com.puericulture.secondhand.repository;

import com.puericulture.secondhand.entity.ExternalProduct;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalProductRepository extends JpaRepository<ExternalProduct, Long> {
    Optional<ExternalProduct> findByEan(String ean);
}
