package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Résumé d'un produit disponible en location")
public class ProductLeasingResponse {

    @Schema(description = "Identifiant du produit", example = "1")
    private Long productId;

    @Schema(description = "Titre de l'annonce", example = "Poussette Babyzen Yoyo 2")
    private String postTitle;

    @Schema(description = "Description du produit")
    private String description;

    @Schema(description = "Date de publication de l'annonce")
    private LocalDateTime postDate;

    @Schema(description = "Ville où se trouve le produit", example = "Paris")
    private String city;

    @Schema(description = "Catégorie du produit", example = "Poussette")
    private String category;

    @Schema(description = "Marque du produit", example = "Babyzen")
    private String brand;

    @Schema(description = "Modèle du produit", example = "Yoyo 2")
    private String model;

    @Schema(description = "Prix par mois en centimes", example = "9000")
    private Long pricePerMonth;

    @Schema(description = "Prix par jour en centimes", example = "500")
    private Long pricePerDay;
}
