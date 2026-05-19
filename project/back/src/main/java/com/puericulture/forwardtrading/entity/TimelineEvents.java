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

    /** Event type : Example : BUY / SOLD */
    @Column(name = "type", nullable = false)
    private String type;

    /** Article name - Example : plush bob razowski */
    @Column(name = "article_name", nullable = false)
    private String articleName;

    /** Estimated price */
    @Column(name = "article_price", precision = 10, scale = 2)
    private BigDecimal articlePrice;

    /** Article category - Examples : - FOOD - TOY */
    @Column(name = "article_tag", length = 50)
    private String articleTag;

    /** Period - to indicate to which period you should buy the article */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "period_id")
    private TimelinePeriods period;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timeline_id", nullable = false)
    private Timelines timeline;
}
