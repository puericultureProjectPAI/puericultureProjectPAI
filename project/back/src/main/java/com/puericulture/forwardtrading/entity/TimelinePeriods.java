package com.puericulture.forwardtrading.entity;

import jakarta.persistence.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "timeline_periods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TimelinePeriods {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "label", length = 50, nullable = false)
    private String label;

    @Column(name = "week_duration", nullable = false)
    private Integer weekDuration;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @OneToMany(mappedBy = "period", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimelineEvents> events;
}
