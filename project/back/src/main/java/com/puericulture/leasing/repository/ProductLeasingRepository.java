package com.puericulture.leasing.repository;

import com.puericulture.leasing.entity.LeasingArticle;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductLeasingRepository extends JpaRepository<LeasingArticle, Long> {

    @Query("SELECT p FROM LeasingArticle p ORDER BY p.pricePerDay ASC")
    List<LeasingArticle> findAllWithLeasing();

    @Query(
            "SELECT p FROM LeasingArticle p "
                    + "WHERE LOWER(p.city) = LOWER(:city) "
                    + "ORDER BY p.pricePerDay ASC")
    List<LeasingArticle> findByCity(@Param("city") String city);

    /**
     * Retourne les IDs des produits disponibles sur la période donnée. Un produit est disponible
     * s'il n'existe aucune commande (leasing_orders) dont les dates chevauchent la période
     * demandée. Overlap : lo.start_date <= endDate ET lo.end_date >= startDate
     */
    @Query(
            value =
                    "SELECT pl.product_id FROM product_leasing pl "
                            + "WHERE NOT EXISTS ("
                            + "  SELECT 1 FROM client_products cp "
                            + "  JOIN leasing_orders lo ON lo.client_product_id = cp.id "
                            + "  WHERE cp.product_id = pl.product_id "
                            + "  AND lo.start_date <= :endDate "
                            + "  AND lo.end_date >= :startDate"
                            + ")",
            nativeQuery = true)
    List<Long> findAvailableIdsByDateRange(
            @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /** Retourne les IDs des produits disponibles dans une ville sur la période donnée. */
    @Query(
            value =
                    "SELECT pl.product_id FROM product_leasing pl "
                            + "JOIN products p ON p.id = pl.product_id "
                            + "WHERE LOWER(p.city) = LOWER(:city) "
                            + "AND NOT EXISTS ("
                            + "  SELECT 1 FROM client_products cp "
                            + "  JOIN leasing_orders lo ON lo.client_product_id = cp.id "
                            + "  WHERE cp.product_id = pl.product_id "
                            + "  AND lo.start_date <= :endDate "
                            + "  AND lo.end_date >= :startDate"
                            + ")",
            nativeQuery = true)
    List<Long> findAvailableIdsByCityAndDateRange(
            @Param("city") String city,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT DISTINCT LOWER(p.city) FROM LeasingArticle p ORDER BY LOWER(p.city) ASC")
    List<String> findAllAvailableCities();
}
