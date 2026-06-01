package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.TrocSuggestionResponse;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/troc/suggestions")
@RequiredArgsConstructor
@Tag(
        name = "Troc Suggestions",
        description = "Endpoints allowing users to receive and manage automatic troc suggestions.")
public class TrocSuggestionController {

    private final TrocSuggestionService trocSuggestionService;

    @Operation(
            summary = "Get automatic troc suggestions",
            description =
                    "Returns relevant troc suggestions for the connected user based on available products, category compatibility and exchange history.")
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
                                                                TrocSuggestionResponse.class))),
                @ApiResponse(responseCode = "401", description = "Authentication is required.")
            })
    @GetMapping
    public List<TrocSuggestionResponse> getSuggestions(
            @AuthenticationPrincipal String authenticatedPersonId) {
        return trocSuggestionService.getSuggestionsForConnectedUser(
                UUID.fromString(authenticatedPersonId));
    }

    @Operation(
            summary = "Get a troc suggestion detail",
            description =
                    "Returns the details of a suggestion already generated for the connected user.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Suggestion successfully retrieved."),
                @ApiResponse(responseCode = "404", description = "Suggestion not found.")
            })
    @GetMapping("/{suggestionId}")
    public TrocSuggestionResponse getSuggestionDetails(
            @AuthenticationPrincipal String authenticatedPersonId,
            @PathVariable Long suggestionId) {
        return trocSuggestionService.getSuggestionDetails(
                suggestionId, UUID.fromString(authenticatedPersonId));
    }

    @Operation(
            summary = "Ignore a troc suggestion",
            description = "Marks a suggestion as ignored so it is not proposed again to the user.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Suggestion ignored successfully."),
                @ApiResponse(responseCode = "404", description = "Suggestion not found.")
            })
    @PostMapping("/{suggestionId}/ignore")
    public void ignoreSuggestion(
            @AuthenticationPrincipal String authenticatedPersonId,
            @PathVariable Long suggestionId) {
        trocSuggestionService.ignoreSuggestion(
                suggestionId, UUID.fromString(authenticatedPersonId));
    }

    @Operation(
            summary = "Accept a troc suggestion",
            description =
                    "Creates an exchange proposal from the accepted suggestion. No exchange is created until the user validates this action.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Exchange proposal created from suggestion.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ExchangeResponse.class))),
                @ApiResponse(responseCode = "400", description = "Suggestion cannot be accepted."),
                @ApiResponse(responseCode = "404", description = "Suggestion not found.")
            })
    @PostMapping("/{suggestionId}/accept")
    public ExchangeResponse acceptSuggestion(
            @AuthenticationPrincipal String authenticatedPersonId,
            @PathVariable Long suggestionId) {
        return trocSuggestionService.acceptSuggestion(
                suggestionId, UUID.fromString(authenticatedPersonId));
    }
}
