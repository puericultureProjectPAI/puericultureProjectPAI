package com.puericulture.forwardtrading.controller;

import com.puericulture.config.errormanager.ErrorResponse;
import com.puericulture.forwardtrading.dto.OnBoardingDto;
import com.puericulture.forwardtrading.service.OnBoardingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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
@RequiredArgsConstructor
@Tag(
        name = "On-Boarding (Forward Trading)",
        description = "Endpoints allowing users to create their on-boarding.")
public class OnBoardingController extends ForwardTradingController {

    private final OnBoardingService onBoardingService;

    @Operation(
            summary = "Create an on-boarding",
            description =
                    "Allows a user to create his on-boarding by submitting his family situation")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "On-boarding successfully created.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = OnBoardingDto.class),
                                        examples = {
                                            @ExampleObject(
                                                    name = "On-Boarding Both Example",
                                                    summary =
                                                            "User who is both a parent and expecting",
                                                    value =
                                                            "{\n"
                                                                    + "  \"familyStatus\": \"both\",\n"
                                                                    + "  \"dueDate\": \"2026-10-15\",\n"
                                                                    + "  \"children\": [\n"
                                                                    + "    {\n"
                                                                    + "      \"name\": \"Léo\",\n"
                                                                    + "      \"birthDate\": \"2022-05-12\",\n"
                                                                    + "      \"gender\": \"boy\"\n"
                                                                    + "    },\n"
                                                                    + "    {\n"
                                                                    + "      \"name\": \"Mia\",\n"
                                                                    + "      \"birthDate\": \"2024-10-20\",\n"
                                                                    + "      \"gender\": \"girl\"\n"
                                                                    + "    }\n"
                                                                    + "  ],\n"
                                                                    + "  \"futurePlans\": \"yes\"\n"
                                                                    + "}"),
                                            @ExampleObject(
                                                    name = "On-Boarding Parent Example",
                                                    summary =
                                                            "User who is only a parent (dueDate null)",
                                                    value =
                                                            "{\n"
                                                                    + "  \"familyStatus\": \"parent\",\n"
                                                                    + "  \"dueDate\": null,\n"
                                                                    + "  \"children\": [\n"
                                                                    + "    {\n"
                                                                    + "      \"name\": \"Léo\",\n"
                                                                    + "      \"birthDate\": \"2022-05-12\",\n"
                                                                    + "      \"gender\": \"boy\"\n"
                                                                    + "    }\n"
                                                                    + "  ],\n"
                                                                    + "  \"futurePlans\": \"undecided\"\n"
                                                                    + "}"),
                                            @ExampleObject(
                                                    name = "On-Boarding Expecting Example",
                                                    summary =
                                                            "User who is only expecting (children empty)",
                                                    value =
                                                            "{\n"
                                                                    + "  \"familyStatus\": \"expecting\",\n"
                                                                    + "  \"dueDate\": \"2026-10-15\",\n"
                                                                    + "  \"children\": [],\n"
                                                                    + "  \"futurePlans\": \"no\"\n"
                                                                    + "}")
                                        })),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid request body.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class))),
                @ApiResponse(
                        responseCode = "403",
                        description = "On-boarding does not depend on the current user.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class)))
            })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/on-boarding")
    public ResponseEntity<OnBoardingDto> createOnBoarding(
            @Valid @RequestBody OnBoardingDto onBoardingDto,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(onBoardingService.createOnBoarding(onBoardingDto, userId));
    }
}
