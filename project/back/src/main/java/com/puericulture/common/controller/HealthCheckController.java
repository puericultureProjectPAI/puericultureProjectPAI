package com.puericulture.common.controller;

import com.puericulture.common.dto.HealthCheckResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * STRATEGIC INTENT: This controller is the reference template for all API endpoints in the project.
 * * WHY THIS MATTERS: 1. Unblocks Frontend: UI developers rely on the generated Swagger UI to mock
 * their API calls immediately, long before the backend logic is fully implemented. 2. Enforces
 * Standards: If an endpoint lacks this level of OpenAPI documentation, the Pull Request must be
 * rejected. No exceptions. 3. Speeds up Onboarding: New developers read the contract first,
 * understanding the business goal in 30 seconds without reading the underlying service logic.
 */
@RestController
@RequestMapping("/api/public/health")
@Tag(
        name = "System Diagnostics",
        description =
                "Endpoints for infrastructure monitoring and frontend-backend synchronization")
public class HealthCheckController {

    @Operation(
            summary = "Verify system integrity",
            description =
                    "Acts as a primary heartbeat check. If this endpoint fails, the frontend should immediately display a maintenance screen to the user.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "System is fully operational.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                HealthCheckResponse.class))),
                @ApiResponse(
                        responseCode = "503",
                        description =
                                "Service Unavailable. Database or AI OpenRouter connection is down.",
                        content =
                                @Content(mediaType = "application/json") // No schema means we just
                        // return an error format
                        )
            })
    @GetMapping
    public ResponseEntity<HealthCheckResponse> checkHealth() {
        // Implementation: Returning a mocked response to satisfy the contract immediately.
        // Vitesse > Perfection: We deliver the contract first, wire the real logic later.
        HealthCheckResponse response =
                HealthCheckResponse.builder()
                        .status("OPERATIONAL")
                        .version("1.0.0-MVP")
                        .timestamp(System.currentTimeMillis())
                        .build();

        return ResponseEntity.ok(response);
    }
}
