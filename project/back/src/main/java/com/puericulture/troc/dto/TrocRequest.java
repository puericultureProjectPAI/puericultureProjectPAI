package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.sql.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request payload used to publish a troc product.")
public class TrocRequest {

    @NotBlank
    @Schema(
            description = "Title displayed for the troc product.",
            example = "Poussette à échanger",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @NotBlank
    @Schema(
            description = "Detailed description of the product and its condition.",
            example = "Poussette en bon état, utilisée quelques mois.",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;

    @NotNull @PositiveOrZero
    @Schema(
            description = "Estimated product value in euros.",
            example = "40",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Long estimatedPrice;

    @Schema(description = "City where the product is located.", example = "Lille")
    private String city;

    @Schema(
            description =
                    "Functional product category label. It is not the business type; Troc is represented by the product_troc specialization.",
            example = "Poussettes, porte-bébés et sièges auto")
    private String category;

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

    @PositiveOrZero
    @Schema(description = "Maximum supported weight in kilograms.", example = "15")
    private Integer maxWeightKg;

    @PositiveOrZero
    @Schema(description = "Minimum recommended age in months.", example = "0")
    private Integer minAgeMonths;

    @PositiveOrZero
    @Schema(description = "Maximum recommended age in months.", example = "36")
    private Integer maxAgeMonths;
}
