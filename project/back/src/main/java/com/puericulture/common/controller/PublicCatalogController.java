package com.puericulture.common.controller;

import com.puericulture.common.dto.ProductCardDto;
import com.puericulture.common.service.PublicCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/catalog")
@RequiredArgsConstructor
@Tag(
        name = "Global Catalog",
        description = "Endpoints publics pour le catalogue global multi-verticales")
public class PublicCatalogController {

    private final PublicCatalogService publicCatalogService;

    @Operation(
            summary = "Récupérer les produits par âge",
            description =
                    "Retourne une liste de produits (Troc, Location, Seconde Main) adaptés à une tranche d'âge donnée.")
    @GetMapping("/products/by-age")
    public ResponseEntity<List<ProductCardDto>> getProductsByAgeRange(
            @RequestParam Integer minAge, @RequestParam Integer maxAge) {
        return ResponseEntity.ok(publicCatalogService.getProductsByAgeRange(minAge, maxAge));
    }

    @Operation(
            summary = "Récupérer les recommandations",
            description =
                    "Retourne une liste de produits adaptés à l'âge des enfants de l'utilisateur connecté.")
    @GetMapping("/products/recommendations")
    public ResponseEntity<List<ProductCardDto>> getRecommendations(
            @AuthenticationPrincipal String userId) {
        if (userId == null || userId.equals("anonymousUser")) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
        return ResponseEntity.ok(publicCatalogService.getRecommendations(userId));
    }
}
