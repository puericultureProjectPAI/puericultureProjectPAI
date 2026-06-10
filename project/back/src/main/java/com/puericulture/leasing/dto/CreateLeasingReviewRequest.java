package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * STRATEGIC INTENT: Request body for POST /leasing/products/{leasingId}/reviews. WHY THIS MATTERS:
 * The leasingOrderId ties the review to a specific completed rental — it is the key guard against
 * duplicate reviews (one review per order, enforced at DB level by UNIQUE constraint and at service
 * level by an existsByLeasingOrderId check). The authenticated user's UUID is extracted from the
 * JWT, never sent by the client, to prevent impersonation.
 */
@Data
@Schema(description = "Request body to submit a new review for a leased product.")
public class CreateLeasingReviewRequest {

    @NotNull(message = "L'identifiant de la commande de location est obligatoire.") @Schema(
            description =
                    "ID of the leasing order (leasing_orders.client_product_id) for which the review is submitted. "
                            + "Must belong to the authenticated user. Only one review per order is allowed.",
            example = "1",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Long leasingOrderId;

    @NotNull(message = "La note est obligatoire.") @Min(value = 1, message = "La note doit être au minimum 1.")
    @Max(value = 5, message = "La note doit être au maximum 5.")
    @Schema(
            description = "Star rating between 1 (poor) and 5 (excellent).",
            example = "4",
            minimum = "1",
            maximum = "5",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer rating;

    @Schema(
            description = "Optional free-text comment. Can be left empty.",
            example = "Très pratique, bonne qualité !")
    private String comment;
}
