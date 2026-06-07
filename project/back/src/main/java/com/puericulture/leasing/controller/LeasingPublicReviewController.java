package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingProductReviewsResponse;
import com.puericulture.leasing.service.LeasingReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * STRATEGIC INTENT: Exposes public REST APIs for browsing leasing reviews. WHY THIS MATTERS:
 * Provides anonymous browse-access to reviews (essential for the public catalog).
 */
@RestController
@RequestMapping("/public/leasing")
@RequiredArgsConstructor
@Tag(name = "Leasing Public Reviews", description = "Public endpoints for leasing product reviews")
public class LeasingPublicReviewController {

    private final LeasingReviewService leasingReviewService;

    @Operation(
            summary = "Get reviews for a leasing product",
            description =
                    "Retrieves all client reviews left for a specific leased product, along with statistical summary metrics. Accessible to anyone.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Reviews and statistics retrieved successfully.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                LeasingProductReviewsResponse
                                                                        .class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Internal server error.",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/products/{leasingId}/reviews")
    public ResponseEntity<LeasingProductReviewsResponse> getReviewsForProduct(
            @PathVariable Long leasingId) {
        return ResponseEntity.ok(leasingReviewService.getReviewsForProduct(leasingId));
    }
}
