package com.puericulture.troc.repository;

import com.puericulture.troc.entity.Message;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByExchangeIdOrderByMessageTimeAsc(Long exchangeId);

    Optional<Message> findTopByExchangeIdOrderByMessageTimeDesc(Long exchangeId);

    @Query(
            "SELECT COUNT(m) FROM Message m WHERE m.exchange.id = :exchangeId AND m.sender.id != :senderId AND m.messageRead = false")
    int countUnreadByExchangeIdForUser(
            @Param("exchangeId") Long exchangeId, @Param("senderId") UUID senderId);

    @Modifying
    @Query(
            "UPDATE Message m SET m.messageRead = true WHERE m.exchange.id = :exchangeId AND m.sender.id != :senderId AND m.messageRead = false")
    void markAllAsReadForUser(
            @Param("exchangeId") Long exchangeId, @Param("senderId") UUID senderId);
}
