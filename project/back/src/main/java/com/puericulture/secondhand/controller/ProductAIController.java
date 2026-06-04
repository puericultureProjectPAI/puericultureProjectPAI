package com.puericulture.secondhand.controller;

import com.puericulture.secondhand.dto.ProductAnalysisResponse;
import com.puericulture.secondhand.service.GeminiVisionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/second-hand/v1/ai")
@RequiredArgsConstructor
@Tag(name = "IA - Analyse produit", description = "Endpoints d'analyse d'image par IA Gemini")
public class ProductAIController {

    private final GeminiVisionService geminiService;

    private static final int MAX_FILE_COUNT = 5;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @Operation(summary = "Analyser une image avec l'IA Gemini",
               description = "Envoie une ou plusieurs images à Gemini pour obtenir titre, description, catégorie et score de confiance")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Analyse réussie"),
        @ApiResponse(responseCode = "400", description = "Aucune image fournie"),
        @ApiResponse(responseCode = "413", description = "Fichier trop volumineux ou trop d'images"),
        @ApiResponse(responseCode = "415", description = "Type de fichier non supporté"),
        @ApiResponse(responseCode = "503", description = "Service IA indisponible")
    })
    @PostMapping(value = "/analyze-products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductAnalysisResponse> analyzeProducts(
            @RequestParam("images") List<MultipartFile> images) {

        if (images == null || images.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (images.size() > MAX_FILE_COUNT) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
        }

        for (MultipartFile file : images) {
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
            }
        }

        return ResponseEntity.ok(geminiService.analyzeImages(images));
    }
}