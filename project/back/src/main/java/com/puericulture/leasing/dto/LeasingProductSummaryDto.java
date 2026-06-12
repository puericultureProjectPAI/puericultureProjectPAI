package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * STRATEGIC INTENT: Lightweight projection for the leasing catalog list view. WHY: Contains only
 * the fields needed to render a product card — never exposes internal entity state or
 * relationships. available is computed server-side from active leasing orders.
 */
@Data
@Builder
@Schema(description = "Summary of a product available for leasing, used to render catalog cards.")
public class LeasingProductSummaryDto {

    @Schema(
            description = "Unique product identifier.",
            example = "42",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Long id;

    @Schema(
            description = "Product title as published.",
            example = "Poussette Yoyo Babyzen",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String postTitle;

    @Schema(description = "Product category.", example = "Poussette")
    private String category;

    @Schema(description = "City where the product is located.", example = "Paris")
    private String city;

    @Schema(description = "Rental price per day in euros.", example = "5")
    private Long pricePerDay;

    @Schema(
            description = "Rental price per month in euros.",
            example = "90",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Long pricePerMonth;

    @Schema(description = "Physical condition of the product.", example = "Très bon état")
    private String condition;

    @Schema(description = "Listing badge label for the leasing vertical.", example = "Location")
    private String badgeLabel;

    @Schema(
            description = "URL of the first product image. Null if no image has been uploaded.",
            example = "https://example.com/images/poussette.jpg")
    private String firstImageUrl;

    @Schema(
            description =
                    "True if no leasing order is active today. "
                            + "Frontend must grey out and block navigation when false.",
            example = "true",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private boolean available;
}
