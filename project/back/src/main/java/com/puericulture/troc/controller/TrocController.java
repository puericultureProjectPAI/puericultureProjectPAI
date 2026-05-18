package com.puericulture.troc.controller;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.service.TrocService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/troc")
@Tag(name = "Troc", description = "Endpoints for publishing troc products.")
public class TrocController {

    private final TrocService trocService;

    public TrocController(TrocService trocService) {
        this.trocService = trocService;
    }

    @Operation(
            summary = "Publish a troc product",
            description =
                    "Creates a troc product linked to the authenticated user. The product category is the functional product category, while the troc type is represented by the product_troc specialization.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Troc product successfully created.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = TrocDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid troc creation payload.",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(
                        responseCode = "401",
                        description = "Authentication is required to publish a troc product.",
                        content = @Content(mediaType = "application/json"))
            })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrocDto createTroc(
            @AuthenticationPrincipal String authenticatedPersonId,
            @Valid @RequestBody TrocRequest request) {
        return trocService.createTroc(request, UUID.fromString(authenticatedPersonId));
    }
}
