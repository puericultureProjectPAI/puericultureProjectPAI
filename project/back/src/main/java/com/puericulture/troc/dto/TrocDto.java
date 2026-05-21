package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Date;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Response payload returned after publishing a troc product.")
public class TrocDto {

    @Schema(description = "Identifier of the product in the common products table.", example = "12")
    private Long productId;

    @Schema(description = "Title displayed for the troc product.", example = "Poussette à échanger")
    private String title;

    @Schema(description = "Detailed product description.")
    private String description;

    @Schema(description = "Estimated product value in euros.", example = "40")
    private Long estimatedPrice;

    @Schema(description = "Identifier of the product author.")
    private UUID authorId;

    @Schema(description = "Display name of the product author.", example = "Dupont")
    private String authorName;

    @Schema(description = "City where the product is located.", example = "Lille")
    private String city;

    @Schema(
            description = "Product category label.",
            example = "Poussettes, porte-bébés et sièges auto")
    private String category;

    @Schema(description = "Current troc publication status.", example = "AVAILABLE")
    private String status;

    @Schema(description = "Current visible condition of the product.", example = "Bon état")
    private String condition;

    @Schema(description = "Product brand.", example = "Kiabi")
    private String brand;

    @Schema(description = "Product model.", example = "Lullaby")
    private String model;

    @Schema(description = "Product dimensions.", example = "60 x 40 cm")
    private String dimensions;

    @Schema(description = "Last safety check date.", example = "2026-05-21")
    private Date lastCheckDate;

    @Schema(description = "Safety standard associated with the product.", example = "EN 1888")
    private String securityStandard;

    @Schema(description = "Maximum supported weight in kilograms.", example = "15")
    private Integer maxWeightKg;

    @Schema(description = "Minimum recommended age in months.", example = "0")
    private Integer minAgeMonths;

    @Schema(description = "Maximum recommended age in months.", example = "36")
    private Integer maxAgeMonths;
}
