package com.puericulture.secondhand.controller;

import com.puericulture.secondhand.dto.ProductAnalysisResponse;
import com.puericulture.secondhand.service.GeminiVisionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/ai")
@RequiredArgsConstructor
public class ProductAIController {

    private final GeminiVisionService geminiService;

    @PostMapping(value = "/analyze-products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductAnalysisResponse> analyzeProducts(
            @RequestParam("images") List<MultipartFile> images) {

        if (images == null || images.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(geminiService.analyzeImages(images));
    }
}
