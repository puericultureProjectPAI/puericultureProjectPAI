package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.CreateLeasingReviewRequest;
import com.puericulture.leasing.dto.LeasingProductReviewsResponse;
import com.puericulture.leasing.service.LeasingReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * STRATEGIC INTENT: Exposes REST APIs for browsing and submitting leasing reviews. WHY THIS
 * MATTERS: Provides anonymous browse-access to reviews (essential for the public catalog), while
 * securing the submission endpoint behind JWT verification to prevent review spoofing.
 */
@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(
        name = "Leasing Reviews",
        description = "Public and protected endpoints for leasing product reviews")
public class LeasingReviewController {

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
    @GetMapping("/public/leasing/products/{leasingId}/reviews")
    public ResponseEntity<LeasingProductReviewsResponse> getReviewsForProduct(
            @PathVariable Long leasingId) {
        return ResponseEntity.ok(leasingReviewService.getReviewsForProduct(leasingId));
    }

    @Operation(
            summary = "Submit a review for a leased product",
            description =
                    "Creates a review for the specified leasing product. Requires a valid JWT token. "
                            + "The review is bound to a completed order owned by the authenticated user.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Review successfully submitted.",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(
                        responseCode = "400",
                        description =
                                "Invalid request payload, duplicate review submission, or order ownership mismatch.",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(
                        responseCode = "401",
                        description = "Authentication is required to submit a review.",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(
                        responseCode = "500",
                        description = "Internal server error.",
                        content = @Content(mediaType = "application/json"))
            })
    @PostMapping("/leasing/products/{leasingId}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public void createReview(
            @AuthenticationPrincipal String authenticatedPersonId,
            @PathVariable Long leasingId,
            @Valid @RequestBody CreateLeasingReviewRequest request) {
        leasingReviewService.createReview(authenticatedPersonId, leasingId, request);
    }

    @Operation(
            summary = "Get eligible order ID for review",
            description =
                    "Retrieves the latest completed leasing order ID for a given product and authenticated user, if they have one.")
    @GetMapping("/leasing/products/{leasingId}/eligible-order")
    public ResponseEntity<Long> getEligibleOrderId(
            @AuthenticationPrincipal String authenticatedPersonId, @PathVariable Long leasingId) {
        return ResponseEntity.ok(
                leasingReviewService.getEligibleOrderId(authenticatedPersonId, leasingId));
    }
}
