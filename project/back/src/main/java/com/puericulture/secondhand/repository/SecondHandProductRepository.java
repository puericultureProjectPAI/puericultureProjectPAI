package com.puericulture.secondhand.repository;

import com.puericulture.secondhand.entity.SecondHandProduct;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SecondHandProductRepository extends JpaRepository<SecondHandProduct, Long> {

    Optional<SecondHandProduct> findByEan(String ean);

    @Query(
            "SELECT AVG(s.price) FROM SecondHandProduct s "
                    + "WHERE s.category = :category "
                    + "AND s.status = 'ACTIVE' "
                    + "AND s.condition IN ('NEW', 'VERY_GOOD', 'GOOD')")
    Double findAveragePriceByCategory(@Param("category") String category);

    @Query(
            "SELECT COUNT(s) FROM SecondHandProduct s "
                    + "WHERE s.category = :category "
                    + "AND s.status = 'ACTIVE' "
                    + "AND s.condition IN ('NEW', 'VERY_GOOD', 'GOOD')")
    Long countActiveListingsByCategory(@Param("category") String category);
}
