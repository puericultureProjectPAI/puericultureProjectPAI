package com.puericulture.troc.controller;

import com.puericulture.troc.dto.TrocPostDto;
import com.puericulture.troc.service.TrocPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Troc", description = "Gestion des offres de troc")
@RestController
@RequestMapping("/troc/posts")
@RequiredArgsConstructor
public class TrocPostController {

    private final TrocPostService trocPostService;

    @Operation(
            summary = "Lister les offres de troc",
            description = "Retourne toutes les offres, filtrables par catégorie et/ou ville.")
    @GetMapping
    public ResponseEntity<List<TrocPostDto>> getPosts(
            @Parameter(description = "Catégorie du produit") @RequestParam(required = false)
                    String category,
            @Parameter(description = "Ville de l'offre") @RequestParam(required = false)
                    String city) {
        return ResponseEntity.ok(trocPostService.getPosts(category, city));
    }

    @Operation(summary = "Récupérer une offre de troc par son identifiant")
    @GetMapping("/{id}")
    public ResponseEntity<TrocPostDto> getPostById(
            @Parameter(description = "Identifiant de l'offre") @PathVariable Long id) {
        return ResponseEntity.ok(trocPostService.getPostById(id));
    }
}
