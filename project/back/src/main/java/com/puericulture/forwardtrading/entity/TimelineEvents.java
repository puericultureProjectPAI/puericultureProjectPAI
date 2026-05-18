package com.puericulture.forwardtrading.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "timeline_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineEvents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "article_name", nullable = false)
    private String articleName;

    /**
     * NUMERIC(10,2) mapping. We use BigDecimal to avoid floating-point inaccuracies with currency.
     */
    @Column(name = "article_price", precision = 10, scale = 2)
    private BigDecimal articlePrice;

    @Column(name = "article_tag", length = 50)
    private String articleTag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "period_id")
    private TimelinePeriods period;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timeline_id", nullable = false)
    private Timelines timeline;
}
