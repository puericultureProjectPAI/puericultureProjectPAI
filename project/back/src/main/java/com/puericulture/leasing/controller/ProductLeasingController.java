package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingCitiesResponse;
import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.ProductLeasingListResponse;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.service.ProductLeasingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leasing/products")
@RequiredArgsConstructor
@Tag(name = "Product Leasing", description = "APIs pour la gestion de la location de produits")
public class ProductLeasingController {

    private final ProductLeasingService productLeasingService;

    @GetMapping
    @Operation(
            summary = "Récupérer tous les produits en location",
            description =
                    "Retourne la liste complète des produits disponibles à la location, triés par prix par jour croissant.")
    @ApiResponse(
            responseCode = "200",
            description = "Liste de tous les produits",
            content =
                    @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ProductLeasingListResponse.class)))
    public ResponseEntity<ProductLeasingListResponse> findAll() {
        List<ProductLeasingResponse> results = productLeasingService.findAll();
        return ResponseEntity.ok(
                ProductLeasingListResponse.builder()
                        .success(true)
                        .count(results.size())
                        .data(results)
                        .build());
    }

    /**
     * Filtre les produits en location avec critères optionnels. Critères (au moins UN obligatoire)
     * : city, startDate, endDate.
     */
    @PostMapping("/filter")
    @Operation(
            summary = "Filtrer les produits en location",
            description = "Recherche les produits disponibles en location selon ville et/ou dates")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Résultat du filtrage (peut être vide)",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                ProductLeasingListResponse.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Critères invalides (aucun critère, dates incorrectes, etc)",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = Object.class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Erreur serveur interne",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = Object.class)))
            })
    public ResponseEntity<ProductLeasingListResponse> filter(
            @Valid @RequestBody LeasingFilterRequest filterRequest) {
        List<ProductLeasingResponse> results = productLeasingService.filter(filterRequest);

        ProductLeasingListResponse.ProductLeasingListResponseBuilder builder =
                ProductLeasingListResponse.builder()
                        .success(true)
                        .count(results.size())
                        .data(results);

        if (results.isEmpty()) {
            builder.message("Aucun produit trouvé pour ces critères");
        }

        return ResponseEntity.ok(builder.build());
    }

    @GetMapping("/cities")
    @Operation(
            summary = "Récupérer les villes disponibles",
            description =
                    "Retourne la liste de toutes les villes ayant au moins un produit en location")
    @ApiResponse(
            responseCode = "200",
            description = "Liste des villes disponibles",
            content =
                    @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = LeasingCitiesResponse.class)))
    public ResponseEntity<LeasingCitiesResponse> getAvailableCities() {
        List<String> cities = productLeasingService.getAvailableCities();
        return ResponseEntity.ok(
                LeasingCitiesResponse.builder()
                        .success(true)
                        .count(cities.size())
                        .data(cities)
                        .build());
    }
}
