package com.puericulture.leasing.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entité ProductLeasing représentant les paramètres de location d'un produit.
 * Contient les prix journaliers et mensuels.
 */
@Entity
@Table(name = "product_leasing")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductLeasing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price_per_month", nullable = false)
    private Long pricePerMonth;

    @Column(name = "price_per_day", nullable = false)
    private Long pricePerDay;
}

