package com.puericulture.troc.repository;

import com.puericulture.troc.entity.Message;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByExchangeIdOrderByMessageTimeAsc(Long exchangeId);

    Optional<Message> findTopByExchangeIdOrderByMessageTimeDesc(Long exchangeId);
}
