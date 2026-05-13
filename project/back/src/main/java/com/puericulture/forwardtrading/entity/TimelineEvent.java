package com.puericulture.forwardtrading.entity;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.Data;

@Entity
@Table(name = "timeline_event")
@Data
public class TimelineEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String type;

    @ManyToOne
    @JoinColumn(name = "timeline_id")
    private ForwardTradingTimeline timeline;

    @Column(name = "product_id")
    private UUID productId;
}
