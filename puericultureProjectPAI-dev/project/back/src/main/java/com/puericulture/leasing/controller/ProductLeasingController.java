package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.service.ProductLeasingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller pour ProductLeasing
 * Point d'entrée de l'API REST pour la gestion de la location de produits
 *
 * Endpoints:
 * - GET  /product-leasing              : Récupère tous les produits
 * - POST /product-leasing/filter       : Filtre les produits (ville et/ou dates)
 * - GET  /product-leasing/cities       : Récupère les villes disponibles
 */
@RestController
@RequestMapping("/product-leasing")
@CrossOrigin(origins = "*")
@Slf4j
@Tag(name = "Product Leasing", description = "APIs pour la gestion de la location de produits")
public class ProductLeasingController {

    @Autowired
    private ProductLeasingService productLeasingService;

    /**
     * GET: Récupère TOUS les produits en location
     *
     * @return liste de tous les produits disponibles
     */
    @GetMapping
    @Operation(summary = "Récupérer tous les produits en location")
    @ApiResponse(
            responseCode = "200",
            description = "Liste de tous les produits"
    )
    public ResponseEntity<Map<String, Object>> findAll() {
        List<ProductLeasingResponse> results = productLeasingService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", results.size());
        response.put("data", results);

        log.info("{} produits retournés", results.size());
        return ResponseEntity.ok(response);
    }

    /**
     * POST: Filtre les produits en location avec critères optionnels
     *
     * Critères (au moins UN obligatoire):
     * - city: ville du produit (case-insensitive)
     * - startDate: date de début (YYYY-MM-DD)
     * - endDate: date de fin (YYYY-MM-DD)
     *
     * Exemples:
     * - Juste ville: { "city": "Paris" }
     * - Juste dates: { "startDate": "2025-06-01", "endDate": "2025-06-30" }
     * - Ville + Dates: { "city": "Paris", "startDate": "2025-06-01", "endDate": "2025-06-30" }
     *
     * @param filterRequest critères de filtrage (au moins un doit être fourni)
     * @return liste des produits filtrés
     */
    @PostMapping("/filter")
    @Operation(
            summary = "Filtrer les produits en location",
            description = "Recherche les produits disponibles en location selon ville et/ou dates"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Résultat du filtrage (peut être vide)",
                    content = @Content(schema = @Schema(implementation = Map.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Critères invalides (aucun critère, dates incorrectes, etc)"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Erreur serveur interne"
            )
    })
    public ResponseEntity<Map<String, Object>> filter(@Valid @RequestBody LeasingFilterRequest filterRequest) {
        List<ProductLeasingResponse> results = productLeasingService.filter(filterRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", results.size());
        response.put("data", results);

        if (results.isEmpty()) {
            response.put("message", "Aucun produit trouvé pour ces critères");

        }

        log.info("Filtrage effectué: {} produits trouvés", results.size());
        return ResponseEntity.ok(response);
    }

    /**
     * GET: Récupère toutes les villes disponibles
     * Utilisé pour remplir les dropdowns de filtrage frontend
     *
     * @return liste des villes disponibles (triées)
     */
    @GetMapping("/cities")
    @Operation(
            summary = "Récupérer les villes disponibles",
            description = "Retourne la liste de toutes les villes ayant au moins un produit en location"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Liste des villes disponibles"
    )
    public ResponseEntity<Map<String, Object>> getAvailableCities() {
        List<String> cities = productLeasingService.getAvailableCities();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", cities.size());
        response.put("data", cities);

        return ResponseEntity.ok(response);
    }
}



