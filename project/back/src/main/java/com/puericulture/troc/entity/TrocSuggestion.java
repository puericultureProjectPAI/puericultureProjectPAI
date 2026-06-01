package com.puericulture.troc.entity;

import com.puericulture.common.entity.Person;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "troc_suggestions",
        schema = "public",
        uniqueConstraints = {
            @UniqueConstraint(
                    name = "uk_troc_suggestion_user_products",
                    columnNames = {
                        "connected_user_id",
                        "requester_product_id",
                        "suggested_product_id"
                    })
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrocSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connected_user_id", nullable = false)
    private Person connectedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_product_id", nullable = false)
    private ProductTroc requesterProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suggested_product_id", nullable = false)
    private ProductTroc suggestedProduct;

    @Column(name = "compatibility_score", nullable = false)
    private Integer compatibilityScore;

    @Column(name = "compatibility_reason", length = 500)
    private String compatibilityReason;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrocSuggestionStatus status = TrocSuggestionStatus.ACTIVE;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
