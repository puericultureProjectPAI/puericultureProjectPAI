package com.puericulture.troc.repository;

import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    List<Exchange> findByStatus(ExchangeStatus status);

    boolean existsByProposerProductIdAndReceiverProductId(
            Long proposerProductId, Long receiverProductId);
}
