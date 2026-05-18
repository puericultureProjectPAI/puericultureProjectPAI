package com.puericulture.forwardtrading.entity;

import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "timeline_periods")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelinePeriods {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Period type - Example : Q1 (Quarter), First-Weeks */
    @Column(name = "type", length = 50)
    private String type;

    /** Period name - Examples : "0-3 Months" , "0-2 Weeks" */
    @Column(name = "label", length = 50, nullable = false)
    private String label;

    /** Period duration in week : Example : 4 */
    @Column(name = "week_duration", nullable = false)
    private Integer weekDuration;

    /**
     * Position in the timeline. Example : - Period Q1-Q3 is before Q4-Q7, so Q1-Q3's orderIndex is
     * lower than Q4-Q7
     */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @OneToMany(mappedBy = "period", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimelineEvents> events;
}
