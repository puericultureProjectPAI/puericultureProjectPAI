package com.puericulture.troc.entity;

import com.puericulture.common.entity.Person;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.*;

@Data
@Entity
@Table(name = "messages", schema = "public")
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private Person sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exchange_id", nullable = false)
    private Exchange exchange;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "message_read")
    private Boolean messageRead = false;

    @Column(name = "message_time")
    private OffsetDateTime messageTime = OffsetDateTime.now();
}
