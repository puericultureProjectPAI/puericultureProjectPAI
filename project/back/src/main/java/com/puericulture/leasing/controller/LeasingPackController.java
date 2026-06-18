package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingPackDto;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.service.LeasingPackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/leasing/arrival-pack")
@RequiredArgsConstructor
@Tag(name = "Leasing Arrival Pack", description = "Endpoints for smart arrival pack generation")
public class LeasingPackController {

    private final LeasingPackService leasingPackService;

    @Operation(
            summary = "Generate a smart arrival pack based on child age",
            description =
                    "Analyzes the authenticated user's profile to find their child's age, and generates a personalized list of required leasing articles in the specified city.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Pack generated successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = LeasingPackDto.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized - User is not logged in",
                        content = @Content),
                @ApiResponse(
                        responseCode = "404",
                        description = "Not Found - User has no child registered",
                        content = @Content)
            })
    @GetMapping
    public ResponseEntity<LeasingPackDto> generateArrivalPack(
            @Parameter(description = "City where the equipment is needed") @RequestParam
                    String city,
            @Parameter(description = "Start date of the stay")
                    @RequestParam
                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate startDate,
            @Parameter(description = "End date of the stay")
                    @RequestParam
                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate endDate,
            @Parameter(description = "Whether the user needs car equipment") @RequestParam
                    boolean carNeeded,
            @Parameter(
                            description =
                                    "Optional first name of the child to select if the user has multiple children")
                    @RequestParam(required = false)
                    String childFirstName) {

        return ResponseEntity.ok(
                leasingPackService.generateArrivalPack(
                        city, startDate, endDate, carNeeded, childFirstName));
    }

    @Operation(
            summary = "List eligible products for an arrival pack",
            description =
                    "Returns available leasing products matching the selected city, dates and child age.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Eligible products retrieved successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                LeasingProductSummaryDto.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized - User is not logged in",
                        content = @Content),
                @ApiResponse(
                        responseCode = "404",
                        description = "Not Found - User or child not found",
                        content = @Content)
            })
    @GetMapping("/eligible-products")
    public ResponseEntity<List<LeasingProductSummaryDto>> findEligibleProducts(
            @RequestParam String city,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String childFirstName) {
        return ResponseEntity.ok(
                leasingPackService.findEligibleProducts(city, startDate, endDate, childFirstName));
    }
}
