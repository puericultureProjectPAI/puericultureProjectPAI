package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI-generated condition analysis result for a product image.")
public class ConditionAnalysisResponse {

    @Schema(
            description =
                    "Estimated condition of the article. Null if the image quality is insufficient.",
            example = "Bon état",
            allowableValues = {"Neuf", "Très bon état", "Bon état", "État correct", "Usé"})
    private String condition;

    @Schema(
            description = "AI confidence score for the estimation, between 0 and 100.",
            example = "82")
    private Integer confidenceScore;

    @Schema(
            description =
                    "True if the image contains multiple distinct items,"
                            + " making it impossible to evaluate a single article.",
            example = "false")
    private boolean multipleItemsDetected;
}
