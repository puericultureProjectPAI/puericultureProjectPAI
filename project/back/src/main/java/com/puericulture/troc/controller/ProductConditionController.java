package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ConditionAnalysisResponse;
import com.puericulture.troc.service.ProductConditionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/troc/ai")
@RequiredArgsConstructor
@Tag(name = "Troc AI", description = "AI-powered features for troc product publication")
public class ProductConditionController {

    private final ProductConditionService conditionService;

    @PostMapping("/condition")
    @Operation(
            summary = "Estimate article condition from image",
            description =
                    "Analyzes a product image URL using AI and returns an estimated condition"
                            + " among: Neuf, Très bon état, Bon état, État correct, Usé."
                            + " Returns null condition if the image quality is insufficient.")
    @ApiResponse(
            responseCode = "200",
            description = "Analysis successful",
            content =
                    @Content(
                            schema = @Schema(implementation = ConditionAnalysisResponse.class),
                            examples =
                                    @ExampleObject(
                                            value =
                                                    "{\"condition\": \"Bon état\","
                                                            + " \"confidenceScore\": 78}")))
    @ApiResponse(responseCode = "400", description = "Invalid image URL")
    @ApiResponse(responseCode = "503", description = "AI service unavailable")
    public ResponseEntity<ConditionAnalysisResponse> evaluateCondition(
            @Parameter(
                            description = "Cloudinary URL of the product image to analyze",
                            example = "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                            required = true)
                    @RequestParam
                    String imageUrl) {

        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(conditionService.analyzeCondition(imageUrl));
    }
}
