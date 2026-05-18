package com.puericulture.leasing.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO résumé d'un produit en location
 * Contient SEULEMENT les données du Product + ProductLeasing
 * Pas d'infos auteur
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductLeasingResponse {

    // --- Infos Product
    private Long productId;
    private String postTitle;
    private String description;
    private LocalDateTime postDate;
    private String city;
    private String category;
    private String brand;
    private String model;

    // --- Infos ProductLeasing
    private Long leasingId;
    private Long pricePerMonth;
    private Long pricePerDay;
}
