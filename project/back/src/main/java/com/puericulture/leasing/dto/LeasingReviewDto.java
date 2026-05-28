package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.OffsetDateTime;
import lombok.Builder;
import lombok.Data;

/**
 * STRATEGIC INTENT: Read-only projection returned by GET /public/leasing/products/{id}/reviews. WHY
 * THIS MATTERS: Contains only what the product detail page needs to render a review card — never
 * exposes internal IDs or FK references. The reviewer's name is resolved server-side via a JOIN on
 * public.person so the frontend never handles UUID lookups.
 */
@Data
@Builder
@Schema(description = "A single leasing review displayed on the product detail page.")
public class LeasingReviewDto {

    @Schema(
            description = "Display name of the user who submitted the review.",
            example = "Auteur Test",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String reviewerName;

    @Schema(
            description = "Star rating given by the reviewer, between 1 and 5.",
            example = "4",
            minimum = "1",
            maximum = "5",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer rating;

    @Schema(
            description = "Timestamp when the review was submitted.",
            example = "2026-05-28T19:00:00+02:00",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private OffsetDateTime reviewDate;

    @Schema(
            description =
                    "Optional free-text comment left by the reviewer. Null if no comment was provided.",
            example = "Très pratique, bonne qualité !")
    private String comment;
}
