package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request payload to create a leasing article.")
public class LeasingArticleRequest {

    @NotBlank
    @Schema(
            description = "Title of the article.",
            example = "Poussette Yoyo légère",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @NotBlank
    @Schema(
            description = "Description of the article.",
            example = "Poussette pliable idéale pour voyager.",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;

    @NotBlank
    @Schema(
            description = "Category label.",
            example = "Poussettes, porte-bébés et sièges auto",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String category;

    @NotBlank
    @Schema(
            description = "City where the article is located.",
            example = "Paris",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String city;

    @Schema(description = "Condition of the article.", example = "Très bon état")
    private String condition;

    @Schema(description = "Brand of the article.", example = "Babyzen")
    private String brand;

    @Schema(description = "Dimensions of the article.", example = "52x44x18 cm")
    private String dimensions;

    @Schema(description = "Minimum recommended age in months.", example = "0")
    private Integer minAgeMonths;

    @Schema(description = "Maximum recommended age in months.", example = "48")
    private Integer maxAgeMonths;

    @Schema(description = "Maximum weight in kg.", example = "22")
    private Integer maxWeightKg;

    @NotNull @PositiveOrZero
    @Schema(
            description = "Price per day in euros.",
            example = "5",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Long pricePerDay;

    @NotNull @PositiveOrZero
    @Schema(
            description = "Price per month in euros.",
            example = "90",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Long pricePerMonth;

    @Schema(
            description = "Cloudinary URLs of images to associate with the article.",
            example = "[\"https://res.cloudinary.com/demo/image/upload/sample.jpg\"]")
    private List<String> images;
}
