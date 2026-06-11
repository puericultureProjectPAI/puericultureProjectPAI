package com.puericulture.common.repository;

import com.puericulture.common.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.minAgeMonths <= :maxAge AND p.maxAgeMonths >= :minAge")
    List<Product> findProductsByAgeRange(
            @Param("minAge") Integer minAge, @Param("maxAge") Integer maxAge);
}
