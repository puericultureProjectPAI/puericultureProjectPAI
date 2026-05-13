package com.puericulture.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "products")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "author_id")
    private UUID authorId;

    @Column(name = "post_title", nullable = false)
    private String postTitle;

    @Column(name = "post_date", nullable = false)
    private LocalDateTime postDate;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "last_check_date")
    private LocalDate lastCheckDate;

    @Column(name = "security_standard")
    private String securityStandard;

    @Column(name = "max_weight_kg")
    private Integer maxWeightKg;

    private String dimensions;

    @Column(name = "min_age_months")
    private Integer minAgeMonths;

    @Column(name = "max_age_months")
    private Integer maxAgeMonths;

    private String brand;

    private String model;

    @Column(nullable = false)
    private String category;

    @PrePersist
    void prePersist() {
        if (postDate == null) {
            postDate = LocalDateTime.now();
        }
    }
}
