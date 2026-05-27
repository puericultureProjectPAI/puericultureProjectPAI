package com.puericulture.forwardtrading.entity;

import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "timelines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Timelines {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "children_id", nullable = false)
    private ChildrenEntity children;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "timeline", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimelineEvents> events;
}
