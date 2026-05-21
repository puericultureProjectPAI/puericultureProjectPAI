package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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

    @Schema(
            description = "Optional image reference or URL provided by the frontend.",
            example = "https://example.com/image.jpg")
    private String imageReference;

    @Schema(description = "City where the product is located.", example = "Lille")
    private String city;

    @Schema(
            description =
                    "Product category identifier. It is not the business type; Troc is represented by the product_troc specialization.",
            example = "3")
    private String category;
}
