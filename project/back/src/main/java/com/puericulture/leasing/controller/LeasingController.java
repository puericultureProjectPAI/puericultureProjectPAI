package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingPackReservationRequestDto;
import com.puericulture.leasing.dto.LeasingPackReservationResponseDto;
import com.puericulture.leasing.dto.LeasingProfileDto;
import com.puericulture.leasing.dto.LeasingReservationRequestDto;
import com.puericulture.leasing.dto.LeasingReservationResponseDto;
import com.puericulture.leasing.service.LeasingBookingService;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leasing")
@RequiredArgsConstructor
@Tag(name = "Leasing", description = "Endpoints for leasing operations")
public class LeasingController {

    private final LeasingBookingService leasingBookingService;

    @Operation(
            summary = "Reserve a leasing article",
            description =
                    "Creates a booking for a leasing article for the specified dates and updates the customer profile address")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Article reserved successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                LeasingReservationResponseDto
                                                                        .class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid dates or booking overlap",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(
                        responseCode = "404",
                        description = "Article not found",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized",
                        content = @Content(mediaType = "application/json"))
            })
    @PostMapping("/reservations")
    public ResponseEntity<LeasingReservationResponseDto> createReservation(
            @Valid @RequestBody LeasingReservationRequestDto dto,
            @AuthenticationPrincipal String authenticatedPersonId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(leasingBookingService.createReservation(dto, authenticatedPersonId));
    }

    @Operation(
            summary = "Reserve an arrival pack",
            description = "Creates one leasing reservation per selected product in the pack")
    @PostMapping("/reservations/pack")
    public ResponseEntity<LeasingPackReservationResponseDto> createPackReservation(
            @Valid @RequestBody LeasingPackReservationRequestDto dto,
            @AuthenticationPrincipal String authenticatedPersonId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(leasingBookingService.createPackReservation(dto, authenticatedPersonId));
    }

    @Operation(
            summary = "Get user address for leasing delivery",
            description =
                    "Retrieves the street, zip code, and city of the authenticated customer profile")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Address retrieved successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(implementation = LeasingProfileDto.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/profile")
    public ResponseEntity<LeasingProfileDto> getLeasingProfile(
            @AuthenticationPrincipal String authenticatedPersonId) {
        return ResponseEntity.ok(leasingBookingService.getLeasingProfile(authenticatedPersonId));
    }
}
