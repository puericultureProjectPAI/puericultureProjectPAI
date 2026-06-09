package com.puericulture.leasing.controller;

import com.puericulture.config.errormanager.ErrorResponse;
import com.puericulture.leasing.dto.LeasingArticleDetailDto;
import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.service.LeasingArticleService;
import com.puericulture.leasing.service.LeasingProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * STRATEGIC INTENT: Exposes the public catalog of products available for leasing. WHY THIS MATTERS:
 * Frontend relies on this endpoint to display the leasing catalog without authentication.
 * Availability is calculated in real-time: a product with an active leasing order today is returned
 * with available=false and must be shown as greyed out and non-clickable.
 */
@RestController
@RequestMapping("/public/leasing")
@RequiredArgsConstructor
@Tag(
        name = "Leasing Catalog",
        description = "Public endpoints for browsing products available for leasing")
public class LeasingProductController {

    private final LeasingProductService leasingProductService;
    private final LeasingArticleService leasingArticleService;

    @Operation(
            summary = "List all leasing products",
            description =
                    "Returns the full catalog of products registered for leasing. "
                            + "Each product includes real-time availability: if a leasing order is active today, "
                            + "available=false. Frontend must grey out and block navigation for unavailable products.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Catalog retrieved successfully.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                LeasingProductSummaryDto.class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Internal server error. Database query failed.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class)))
            })
    @GetMapping("/products")
    public ResponseEntity<List<LeasingProductSummaryDto>> getProducts() {
        return ResponseEntity.ok(leasingProductService.findAll());
    }

    @Operation(
            summary = "Filtrer les produits en location",
            description =
                    "Recherche les produits disponibles selon ville et/ou dates (au moins un critère obligatoire). "
                            + "Pour les filtres avec dates, seuls les produits sans commande chevauchante sont retournés.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Résultats du filtrage (peut être vide).",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                LeasingProductSummaryDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Critères invalides (aucun critère, dates incorrectes, etc.)",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Erreur serveur interne.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class)))
            })
    @PostMapping("/products/filter")
    public ResponseEntity<List<LeasingProductSummaryDto>> filterProducts(
            @RequestBody LeasingFilterRequest filterRequest) {
        return ResponseEntity.ok(leasingProductService.filter(filterRequest));
    }

    @Operation(
            summary = "Lister les villes disponibles",
            description = "Retourne les villes ayant au moins un produit enregistré en location.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Liste des villes récupérée.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = String.class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Erreur serveur interne.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class)))
            })
    @GetMapping("/products/cities")
    public ResponseEntity<List<String>> getAvailableCities() {
        return ResponseEntity.ok(leasingProductService.getAvailableCities());
    }

    @Operation(
            summary = "Get leasing article details",
            description = "Retrieves the detailed information of a leasing article by its ID")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Article found and returned successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                LeasingArticleDetailDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Leasing article not found",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/articles/{id}")
    public ResponseEntity<LeasingArticleDetailDto> getArticleDetail(@PathVariable Long id) {
        return ResponseEntity.ok(leasingArticleService.getArticleDetail(id));
    }
}
