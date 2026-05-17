package com.puericulture.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * STRATEGIC INTENT: This DTO separates the external contract from our internal database models.
 * WHY: We never expose entities directly. This prevents accidental data leaks and ensures the
 * frontend only receives what it explicitly needs to render the UI.
 */
@Data
@Builder
@Schema(description = "Standardized response payload for system health verification.")
public class HealthCheckResponse {

    @Schema(
            description = "Current operational status of the API.",
            example = "OPERATIONAL",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String status;

    @Schema(
            description =
                    "The deployed version. Used by the frontend to ensure cache invalidation and compatibility.",
            example = "1.0.0-MVP")
    private String version;

    @Schema(
            description =
                    "Timestamp of the check. Ensures the response is not a stale cached payload.",
            example = "1715765255")
    private long timestamp;
}
