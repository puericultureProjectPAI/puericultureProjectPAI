package com.puericulture.secondhand.repository;

import com.puericulture.secondhand.entity.SecondHandProduct;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecondHandProductRepository extends JpaRepository<SecondHandProduct, Long> {
    Optional<SecondHandProduct> findByEan(String ean);
}
