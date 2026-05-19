package com.puericulture.leasing.repository;

import com.puericulture.leasing.entity.ProductLeasing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductLeasingRepository extends JpaRepository<ProductLeasing, Long> {

    @Query("SELECT p FROM ProductLeasing p ORDER BY p.pricePerDay ASC")
    List<ProductLeasing> findAllWithLeasing();

    @Query("SELECT p FROM ProductLeasing p " +
            "WHERE LOWER(p.city) = LOWER(:city) " +
            "ORDER BY p.pricePerDay ASC")
    List<ProductLeasing> findByCity(@Param("city") String city);

    @Query("SELECT p FROM ProductLeasing p " +
            "WHERE CAST(p.postDate AS DATE) >= :startDate " +
            "AND CAST(p.postDate AS DATE) <= :endDate " +
            "ORDER BY p.pricePerDay ASC")
    List<ProductLeasing> findByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT p FROM ProductLeasing p " +
            "WHERE LOWER(p.city) = LOWER(:city) " +
            "AND CAST(p.postDate AS DATE) >= :startDate " +
            "AND CAST(p.postDate AS DATE) <= :endDate " +
            "ORDER BY p.pricePerDay ASC")
    List<ProductLeasing> findByLocationAndDates(
            @Param("city") String city,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT DISTINCT LOWER(p.city) FROM ProductLeasing p ORDER BY LOWER(p.city) ASC")
    List<String> findAllAvailableCities();
}
