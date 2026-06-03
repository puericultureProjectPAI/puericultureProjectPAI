package com.puericulture.secondhand.controller;

import com.puericulture.secondhand.dto.ProductAnalysisResponse;
import com.puericulture.secondhand.service.GeminiVisionService;
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
public class ProductAIController {

    private final GeminiVisionService geminiService;

    private static final int MAX_FILE_COUNT = 5;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo en octets

    @PostMapping(value = "/analyze-products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductAnalysisResponse> analyzeProducts(
            @RequestParam("images") List<MultipartFile> images) {

        // 1. Vérification de la présence
        if (images == null || images.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 2. Vérification du nombre maximum de fichiers
        if (images.size() > MAX_FILE_COUNT) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
        }

        // 3. Vérification de la taille de chaque fichier
        for (MultipartFile file : images) {
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
            }

            // Optionnel : Vérification du type MIME
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
            }
        }

        return ResponseEntity.ok(geminiService.analyzeImages(images));
    }
}
