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

    /**
     * Retourne les IDs des produits disponibles sur la période donnée.
     * Un produit est disponible s'il n'existe aucune commande (leasing_orders)
     * dont les dates chevauchent la période demandée.
     * Overlap : lo.start_date <= endDate ET lo.end_date >= startDate
     */
    @Query(value = "SELECT pl.id FROM product_leasing pl " +
            "WHERE NOT EXISTS (" +
            "  SELECT 1 FROM client_products cp " +
            "  JOIN leasing_orders lo ON lo.client_product_id = cp.id " +
            "  WHERE cp.product_id = pl.id " +
            "  AND lo.start_date <= :endDate " +
            "  AND lo.end_date >= :startDate" +
            ")",
            nativeQuery = true)
    List<Long> findAvailableIdsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Retourne les IDs des produits disponibles dans une ville sur la période donnée.
     */
    @Query(value = "SELECT pl.id FROM product_leasing pl " +
            "JOIN products p ON p.id = pl.id " +
            "WHERE LOWER(p.city) = LOWER(:city) " +
            "AND NOT EXISTS (" +
            "  SELECT 1 FROM client_products cp " +
            "  JOIN leasing_orders lo ON lo.client_product_id = cp.id " +
            "  WHERE cp.product_id = pl.id " +
            "  AND lo.start_date <= :endDate " +
            "  AND lo.end_date >= :startDate" +
            ")",
            nativeQuery = true)
    List<Long> findAvailableIdsByCityAndDateRange(
            @Param("city") String city,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT DISTINCT LOWER(p.city) FROM ProductLeasing p ORDER BY LOWER(p.city) ASC")
    List<String> findAllAvailableCities();
}
