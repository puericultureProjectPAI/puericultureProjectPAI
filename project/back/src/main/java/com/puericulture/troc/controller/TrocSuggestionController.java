package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ProductTrocSuggestionDto;
import com.puericulture.troc.service.TrocSuggestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/troc/suggestions")
@RequiredArgsConstructor
@Tag(
        name = "Troc Suggestions",
        description = "Endpoints returning dynamically computed troc suggestions.")
public class TrocSuggestionController {

    private final TrocSuggestionService trocSuggestionService;

    @Operation(
            summary = "Get automatic troc suggestions",
            description =
                    "Returns the 8 most relevant troc products for the connected user. Suggestions are computed dynamically and are not stored in database.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Suggestions successfully retrieved.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                ProductTrocSuggestionDto.class))),
                @ApiResponse(responseCode = "401", description = "Authentication is required.")
            })
    @GetMapping
    public List<ProductTrocSuggestionDto> getSuggestions(
            @AuthenticationPrincipal String authenticatedPersonId) {
        return trocSuggestionService.getSuggestionsForConnectedUser(
                UUID.fromString(authenticatedPersonId));
    }
}
