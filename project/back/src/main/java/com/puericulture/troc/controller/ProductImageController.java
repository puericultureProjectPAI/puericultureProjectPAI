package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ProductImageDto;
import com.puericulture.troc.service.ProductImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product/images")
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
            summary = "Associate a Cloudinary image URL to a product",
            description =
                    "Saves a Cloudinary image URL and associates it to a product. "
                            + "The image must be uploaded to Cloudinary by the frontend first. "
                            + "Maximum 5 images per product.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Image URL saved and linked to the product.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ProductImageDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Maximum image limit reached.",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(
                        responseCode = "404",
                        description = "Product not found.",
                        content = @Content(mediaType = "application/json"))
            })
    @PostMapping
    public ResponseEntity<ProductImageDto> addImage(
            @RequestParam("imageUrl") String imageUrl, @RequestParam("productId") Long productId) {
        return ResponseEntity.ok(productImageService.addImage(imageUrl, productId));
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
