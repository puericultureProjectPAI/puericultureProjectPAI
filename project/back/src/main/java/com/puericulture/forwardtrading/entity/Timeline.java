package com.puericulture.forwardtrading.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.YearMonth;
import java.time.LocalDateTime;

@Entity
@Table(name = "forward_trading_timeline")
@Data // Lombok génère getters, setters, toString automatiquement
@NoArgsConstructor // Constructeur vide requis par JPA
@AllArgsConstructor // Constructeur avec tous les arguments
@Builder // Facilite la création d'objets dans les tests et services
public class Timeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lien vers le profil parent unifié
    @Column(name = "user_id", nullable = false)
    private String userId;

    // La Date Prévue d'Accouchement (Mois/Année)
    @Column(name = "expected_delivery_date", nullable = false)
    private YearMonth expectedDeliveryDate;

    // Optionnel mais recommandé : tracer quand la frise a été générée
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
