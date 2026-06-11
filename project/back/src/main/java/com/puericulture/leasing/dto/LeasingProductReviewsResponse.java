package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * STRATEGIC INTENT: Wrapper containing reviews list and aggregated statistics for a leasing
 * product. WHY THIS MATTERS: Moves statistics calculation (average rating and total count) to the
 * backend API, simplifying client-side rendering and optimizing performance.
 */
@Data
@Builder
@Schema(
        description =
                "Wrapper containing reviews list and aggregated statistics for a leasing product.")
public class LeasingProductReviewsResponse {

    @Schema(
            description = "Average rating of the product, rounded to 1 decimal place.",
            example = "4.5",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Double averageRating;

    @Schema(
            description = "Total number of reviews for the product.",
            example = "12",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer totalReviews;

    @Schema(
            description = "List of reviews left by users.",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private List<LeasingReviewDto> reviews;
}
