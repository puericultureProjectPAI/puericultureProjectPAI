package com.puericulture.troc.repository;

import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.TriangularExchangeParticipant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TriangularExchangeParticipantRepository
        extends JpaRepository<TriangularExchangeParticipant, Long> {

    List<TriangularExchangeParticipant> findByParticipantId(UUID participantId);

    List<TriangularExchangeParticipant> findByTriangularExchangeId(Long triangularExchangeId);

    Optional<TriangularExchangeParticipant> findByTriangularExchangeIdAndParticipantId(
            Long triangularExchangeId, UUID participantId);

    boolean existsByOfferedProductIdAndStatusIn(Long productId, List<ExchangeStatus> statuses);
}
