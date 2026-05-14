package com.puericulture.leasing.repository;

import com.puericulture.leasing.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository pour l'accès aux données de la verticale leasing.
 * Encapsule les interactions avec la base de données via Spring Data JPA.
 */
@Repository
public interface ProductLeasingRepository extends JpaRepository<Product, Long> {

    /**
     * Récupère TOUS les produits en location
     *
     * @return liste de tous les produits avec ProductLeasing
     */
    @Query("SELECT p FROM Product p " +
            "WHERE p.productLeasing IS NOT NULL " +
            "ORDER BY p.productLeasing.pricePerDay ASC")
    List<Product> findAllWithLeasing();

    /**
     * Filtre par VILLE seulement
     *
     * @param city ville du produit (case-insensitive)
     * @return liste des produits en location dans cette ville
     */
    @Query("SELECT p FROM Product p " +
            "WHERE LOWER(p.city) = LOWER(:city) " +
            "AND p.productLeasing IS NOT NULL " +
            "ORDER BY p.productLeasing.pricePerDay ASC")
    List<Product> findByCity(@Param("city") String city);

    /**
     * Filtre par DATES seulement
     *
     * @param startDate date de début (incluse)
     * @param endDate date de fin (incluse)
     * @return liste des produits publiés pendant cette période
     */
    @Query("SELECT p FROM Product p " +
            "WHERE p.productLeasing IS NOT NULL " +
            "AND CAST(p.postDate AS DATE) >= :startDate " +
            "AND CAST(p.postDate AS DATE) <= :endDate " +
            "ORDER BY p.productLeasing.pricePerDay ASC")
    List<Product> findByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Filtre par VILLE + DATES
     *
     * Critères de recherche:
     * - Ville du produit (case-insensitive)
     * - Date de publication entre startDate et endDate (inclus)
     * - Produit doit avoir une relation ProductLeasing (pas null)
     *
     * Résultats triés par prix croissant pour une meilleure UX.
     *
     * @param city ville du produit recherché
     * @param startDate date de début de la plage (incluse)
     * @param endDate date de fin de la plage (incluse)
     * @return liste des produits disponibles, triés par prix/jour
     */
    @Query("SELECT p FROM Product p " +
            "WHERE LOWER(p.city) = LOWER(:city) " +
            "AND p.productLeasing IS NOT NULL " +
            "AND CAST(p.postDate AS DATE) >= :startDate " +
            "AND CAST(p.postDate AS DATE) <= :endDate " +
            "ORDER BY p.productLeasing.pricePerDay ASC")
    List<Product> findByLocationAndDates(
            @Param("city") String city,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Récupère toutes les villes distinctes ayant au moins un produit en location.
     * Utilisé pour remplir le dropdown de filtrage côté frontend.
     *
     * @return liste des villes disponibles (lowercase)
     */
    @Query("SELECT DISTINCT LOWER(p.city) FROM Product p " +
            "WHERE p.productLeasing IS NOT NULL " +
            "ORDER BY LOWER(p.city) ASC")
    List<String> findAllAvailableCities();
}

