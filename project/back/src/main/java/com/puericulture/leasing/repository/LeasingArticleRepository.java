package com.puericulture.leasing.repository;

import com.puericulture.leasing.entity.LeasingArticle;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LeasingArticleRepository extends JpaRepository<LeasingArticle, Long> {

    /*
     * Charge l'article et ses images en un seul appel BDD (JOIN FETCH)
     * pour éviter le problème N+1 (une requête par image).
     */
    @Query("SELECT a FROM LeasingArticle a LEFT JOIN FETCH a.images WHERE a.id = :id")
    Optional<LeasingArticle> findByIdWithImages(@Param("id") Long id);
}
