package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingPackDto;
import com.puericulture.leasing.service.LeasingPackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
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
    @io.swagger.v3.oas.annotations.responses.ApiResponses(
            value = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "200",
                        description = "Pack generated successfully",
                        content =
                                @io.swagger.v3.oas.annotations.media.Content(
                                        mediaType = "application/json",
                                        schema =
                                                @io.swagger.v3.oas.annotations.media.Schema(
                                                        implementation = LeasingPackDto.class))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized - User is not logged in",
                        content = @io.swagger.v3.oas.annotations.media.Content),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "404",
                        description = "Not Found - User has no child registered",
                        content = @io.swagger.v3.oas.annotations.media.Content)
            })
    @GetMapping
    public ResponseEntity<LeasingPackDto> generateArrivalPack(
            @io.swagger.v3.oas.annotations.Parameter(
                            description = "City where the equipment is needed")
                    @RequestParam
                    String city,
            @io.swagger.v3.oas.annotations.Parameter(description = "Start date of the stay")
                    @RequestParam
                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate startDate,
            @io.swagger.v3.oas.annotations.Parameter(description = "End date of the stay")
                    @RequestParam
                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate endDate,
            @io.swagger.v3.oas.annotations.Parameter(
                            description = "Whether the user needs car equipment")
                    @RequestParam
                    boolean carNeeded,
            @io.swagger.v3.oas.annotations.Parameter(
                            description =
                                    "Optional first name of the child to select if the user has multiple children")
                    @RequestParam(required = false)
                    String childFirstName) {

        return ResponseEntity.ok(
                leasingPackService.generateArrivalPack(
                        city, startDate, endDate, carNeeded, childFirstName));
    }
}
