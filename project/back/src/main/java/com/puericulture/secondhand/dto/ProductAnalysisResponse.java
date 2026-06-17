package com.puericulture.secondhand.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI-generated analysis result for a product image.")
public class ProductAnalysisResponse {

    @Schema(description = "Generated product title in French", example = "Poussette Joie Litetrax")
    private String title;

    @Schema(
            description = "Generated product description in French",
            example = "Poussette en très bon état, légère et maniable.")
    private String description;

    @Schema(
            description = "Product category, one of the predefined allowed values.",
            example = "Poussettes, porte-bébés et sièges auto")
    private String category;

    @Schema(
            description = "AI confidence score for the analysis, between 0 and 100.",
            example = "85.0")
    private Double confidenceScore;

    @Schema(
            description = "Estimated condition of the article. Null if undeterminable.",
            example = "Bon état",
            allowableValues = {"Neuf", "Très bon état", "Bon état", "État correct", "Usé"})
    private String condition;

    @Schema(
            description = "True if multiple distinct items were detected in the image.",
            example = "false")
    private boolean multipleItemsDetected;
}
