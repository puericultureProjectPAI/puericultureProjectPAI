package com.puericulture.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(
        description =
                "DTO global unifié pour afficher les cartes produits de toutes les verticales")
public class ProductCardDto {

    @Schema(description = "ID unique du produit")
    private Long id;

    @Schema(description = "Titre de l'annonce")
    private String postTitle;

    @Schema(description = "URL de la première image")
    private String firstImageUrl;

    @Schema(description = "Type de produit (Location, Troc, Seconde main)")
    private String productType;

    @Schema(description = "Prix formaté selon le type (mensuel, estimé ou prix de vente)")
    private Long price;

    @Schema(description = "Suffixe du prix pour l'affichage (ex: €/mois, €)")
    private String priceSuffix;

    @Schema(description = "Route frontend pour naviguer vers le détail de ce produit")
    private String actionUrl;
}
