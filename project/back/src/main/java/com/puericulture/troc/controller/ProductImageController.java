package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ProductImageDto;
import com.puericulture.troc.service.ProductImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * STRATEGIC INTENT: Manages the lifecycle of images associated to a product listing. Images are
 * stored in Supabase Storage; only the public URL is persisted in the database.
 */
@RestController
@RequestMapping("/api/troc/images")
@Tag(
        name = "Product Images",
        description = "Upload, retrieve and delete images for a product listing")
public class ProductImageController {

    private final ProductImageService productImageService;

    @Autowired
    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @Operation(
            summary = "Get all images for a product",
            description = "Returns the ordered list of images associated to a given product.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Images retrieved successfully.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ProductImageDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Product not found.",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImageDto>> getImagesByProductId(
            @PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.getImagesByProductId(productId));
    }

    @Operation(
            summary = "Upload an image for a product",
            description =
                    "Uploads a file to Supabase Storage and associates its URL to the product. "
                            + "Accepted formats: JPEG, PNG, GIF, WEBP. Maximum 5 images per product.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Image uploaded and linked to the product.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ProductImageDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Unsupported format or maximum image limit reached.",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(
                        responseCode = "404",
                        description = "Product not found.",
                        content = @Content(mediaType = "application/json"))
            })
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductImageDto> uploadImage(
            @RequestParam("file") MultipartFile file, @RequestParam("productId") Long productId)
            throws IOException {
        return ResponseEntity.ok(productImageService.uploadImage(file, productId));
    }

    @Operation(
            summary = "Delete an image",
            description = "Removes an image record from the database by its ID.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "204", description = "Image deleted successfully."),
                @ApiResponse(
                        responseCode = "404",
                        description = "Image not found.",
                        content = @Content(mediaType = "application/json"))
            })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        productImageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}
