package com.puericulture.leasing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

/**
 * Entité Product représentant un article en vente (location, troc, seconde-main, etc.)
 * Contient les informations du produit et ses relations avec les différentes verticales.
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "post_title", nullable = false)
    private String postTitle;

    @Column(name = "post_date", nullable = false)
    private LocalDateTime postDate;

    @Column(nullable = false)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "last_check_date")
    private LocalDate lastCheckDate;

    @Column(name = "security_standard")
    private String securityStandard;

    @Column(name = "max_weight_kg")
    private Integer maxWeightKg;

    @Column
    private String dimensions;

    @Column(name = "min_age_months")
    private Integer minAgeMonths;

    @Column(name = "max_age_months")
    private Integer maxAgeMonths;

    @Column
    private String brand;

    @Column
    private String model;

    @Column(nullable = false)
    private String category;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Person author;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "product_leasing_id")
    private ProductLeasing productLeasing;
}

