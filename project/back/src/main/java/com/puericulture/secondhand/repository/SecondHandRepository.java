package com.puericulture.secondhand.repository;

import com.puericulture.common.entity.ProductCategory;
import com.puericulture.secondhand.entity.SecondHand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SecondHandRepository extends JpaRepository<SecondHand, Long> {

    @Query("SELECT AVG(s.price) FROM SecondHand s " +
           "WHERE s.category = :category")
    Double findAveragePriceByCategory(@Param("category") ProductCategory category);

    @Query("SELECT COUNT(s) FROM SecondHand s " +
           "WHERE s.category = :category")
    Long countActiveListingsByCategory(@Param("category") ProductCategory category);
}