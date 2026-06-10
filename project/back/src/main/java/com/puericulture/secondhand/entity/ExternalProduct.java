package com.puericulture.secondhand.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

/** */
@Entity
@Table(name = "external_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExternalProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ean", nullable = false, unique = true, length = 13)
    private String ean;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "brand", length = 255)
    private String brand;

    @Column(name = "category", length = 255)
    private String category;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "price")
    private BigDecimal price;
}
