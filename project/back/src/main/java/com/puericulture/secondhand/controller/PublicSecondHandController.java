package com.puericulture.secondhand.controller;

import com.puericulture.secondhand.dto.SecondHandDetailDto;
import com.puericulture.secondhand.dto.SecondHandListItemDto;
import com.puericulture.secondhand.service.SecondHandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/second-hand")
@RequiredArgsConstructor
@Tag(name = "Second-Hand Public", description = "Public endpoints for second-hand products")
public class PublicSecondHandController {

    private final SecondHandService secondHandService;

    @Operation(
            summary = "List all second-hand products",
            description = "Returns the full catalog of second-hand products.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Catalog retrieved successfully.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                SecondHandListItemDto.class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Internal server error.",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/products")
    public ResponseEntity<List<SecondHandListItemDto>> getAllProducts() {
        return ResponseEntity.ok(secondHandService.getAllProducts());
    }

    @Operation(
            summary = "Get second-hand product details",
            description = "Retrieves the detailed information of a second-hand product by its ID")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Product details retrieved successfully.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                SecondHandDetailDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Second-hand product not found.",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/products/{id}")
    public ResponseEntity<SecondHandDetailDto> getProductDetail(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(secondHandService.getSecondHandDetail(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
