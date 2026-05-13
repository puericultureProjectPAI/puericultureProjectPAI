package com.puericulture.secondhand.repository;

import com.puericulture.secondhand.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    @Query(
            "SELECT AVG(l.price) FROM Listing l "
                    + "WHERE l.category = :category "
                    + "AND l.status = 'ACTIVE' "
                    + "AND l.condition IN ('NEW', 'VERY_GOOD', 'GOOD')")
    Double findAveragePriceByCategory(@Param("category") String category);

    @Query(
            "SELECT COUNT(l) FROM Listing l "
                    + "WHERE l.category = :category "
                    + "AND l.status = 'ACTIVE' "
                    + "AND l.condition IN ('NEW', 'VERY_GOOD', 'GOOD')")
    Long countActiveListingsByCategory(@Param("category") String category);
}
