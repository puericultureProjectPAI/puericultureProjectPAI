package com.puericulture.common.controller;

import com.puericulture.common.service.ImageManagerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/common/images") // ← fixed: was "common/images" (missing /api prefix)
@RequiredArgsConstructor
@Tag(name = "Gestion des Images", description = "API transverse pour la manipulation des médias")
public class ImageController {

    private final ImageManagerService imageManagerService;

    @Operation(summary = "Delete an image by its URL")
    @DeleteMapping
    public ResponseEntity<Void> deleteImage(@RequestParam String url) {
        // Under real conditions, this endpoint MUST verify that the caller
        // is indeed the owner of the entity linked to this image
        // before ordering the destruction. Don't forget it.
        imageManagerService.deleteImageByUrl(url);
        return ResponseEntity.noContent().build();
    }
}
