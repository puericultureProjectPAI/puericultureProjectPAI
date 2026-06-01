package com.puericulture.troc.repository;

import com.puericulture.troc.entity.TrocSuggestion;
import com.puericulture.troc.entity.TrocSuggestionStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TrocSuggestionRepository extends JpaRepository<TrocSuggestion, Long> {

    @Query(
            """
        SELECT s
        FROM TrocSuggestion s
        WHERE s.connectedUser.id = :connectedUserId
          AND s.status = :status
        ORDER BY s.compatibilityScore DESC
    """)
    List<TrocSuggestion> findActiveSuggestionsForUser(
            @Param("connectedUserId") UUID connectedUserId,
            @Param("status") TrocSuggestionStatus status);

    @Query(
            """
        SELECT s
        FROM TrocSuggestion s
        WHERE s.id = :id
          AND s.connectedUser.id = :connectedUserId
    """)
    Optional<TrocSuggestion> findSuggestionForUser(
            @Param("id") Long id, @Param("connectedUserId") UUID connectedUserId);

    @Query(
            """
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM TrocSuggestion s
        WHERE s.connectedUser.id = :connectedUserId
          AND s.requesterProduct.id = :requesterProductId
          AND s.suggestedProduct.id = :suggestedProductId
    """)
    boolean existsSuggestionForProductPair(
            @Param("connectedUserId") UUID connectedUserId,
            @Param("requesterProductId") Long requesterProductId,
            @Param("suggestedProductId") Long suggestedProductId);
}
