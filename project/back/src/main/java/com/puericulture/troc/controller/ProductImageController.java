package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ProductImageDto;
import com.puericulture.troc.service.ProductImageService;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/troc/images")
public class ProductImageController {

    private final ProductImageService productImageService;

    @Autowired
    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImageDto>> getImagesByProductId(
            @PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.getImagesByProductId(productId));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductImageDto> uploadImage(
            @RequestParam("file") MultipartFile file, @RequestParam("productId") Long productId)
            throws IOException {
        return ResponseEntity.ok(productImageService.uploadImage(file, productId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        productImageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}
