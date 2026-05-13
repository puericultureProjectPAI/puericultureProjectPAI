package com.puericulture.forwardtrading.entity;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Entity
@Table(name = "forward_trading_timeline")
@Data
public class ForwardTradingTimeline {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "children_id")
    private UUID childrenId;

    @OneToMany(mappedBy = "timeline", cascade = CascadeType.ALL)
    private List<TimelineEvent> events;
}
