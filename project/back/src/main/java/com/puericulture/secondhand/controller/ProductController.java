package com.puericulture.secondhand.controller;

import com.puericulture.secondhand.dto.ExternalProductDTO;
import com.puericulture.secondhand.dto.PriceComparisonDTO;
import com.puericulture.secondhand.dto.ProductResponseDTO;
import com.puericulture.secondhand.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@Validated
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{ean}")
    public ResponseEntity<?> getProduct(@PathVariable @Pattern(regexp = "^[0-9]{13}$") String ean) {

        ProductResponseDTO product = productService.getProduct(ean);
        if (product == null) {
            return ResponseEntity.status(404).body(Map.of("error", "PRODUCT_NOT_FOUND"));
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<?> saveProduct(@Valid @RequestBody ExternalProductDTO dto) {
        ProductResponseDTO saved = productService.saveExternalProduct(dto);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping("/{ean}/price-comparison")
    public ResponseEntity<?> getPriceComparison(
            @PathVariable @Pattern(regexp = "^[0-9]{13}$") String ean) {

        ProductResponseDTO product = productService.getProduct(ean);
        if (product == null) {
            return ResponseEntity.status(404).body(Map.of("error", "PRODUCT_NOT_FOUND"));
        }

        PriceComparisonDTO comparison =
                productService.getPriceComparison(product.getCategory(), product.getPrice());
        return ResponseEntity.ok(comparison);
    }
}
