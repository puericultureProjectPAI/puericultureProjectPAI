package com.puericulture.common.entity;

import jakarta.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED) // Pour l'héritage
public abstract class Product {
    /*
       La classe est abstraite : les produits sont soit un Troc, un Leasing ou un SecondHand.
       On peut travailler sur l'ensemble des produits mais pas créer un produit depuis cette classe,
       il faut passer par une sous classe.

       Autrement dit : les types de produits (Leasing, ...) doivent hériter de cette entité.
    */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "post_title", length = 255, nullable = false)
    private String postTitle;

    @Column(name = "post_date", nullable = false)
    private LocalDateTime postDate;

    @Column(name = "city", length = 255, nullable = false)
    private String city;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Convert(converter = ProductCategoryConverter.class)
    @Column(name = "category", length = 255, nullable = false)
    private ProductCategory category;

    // Pour récupérer la version d'affichage : category.getLabel()

    @Column(name = "last_check_date")
    private Date lastCheckDate;

    @Column(name = "security_standard", length = 255)
    private String securityStandard;

    @Column(name = "max_weight_kg")
    private Integer maxWeightKg;

    @Column(name = "dimensions", length = 255)
    private String dimensions;

    @Column(name = "min_age_months")
    private Integer minAgeMonths;

    @Column(name = "max_age_months")
    private Integer maxAgeMonths;

    @Column(name = "brand", length = 255)
    private String brand;

    @Column(name = "model", length = 255)
    private String model;

    @Column(name = "condition", length = 255)
    private String condition;

    @Column(name = "confidence_score")
    private Integer confidenceScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Person author;

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @OrderBy("position ASC")
    private List<ProductImage> images = new ArrayList<>();
}
