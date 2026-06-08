package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ProductTrocDetailDto;
import com.puericulture.troc.service.ProductTrocService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/troc")
@RequiredArgsConstructor
@Tag(name = "Public Troc", description = "Public endpoints for troc products")
public class PublicTrocController {

    private final ProductTrocService productTrocService;

    @Operation(
            summary = "Get troc product detail",
            description = "Returns detailed troc product info including images")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Product found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                ProductTrocDetailDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Product not found",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductTrocDetailDto> getProductDetail(@PathVariable Long id) {
        ProductTrocDetailDto dto = productTrocService.getTrocDetail(id);
        return ResponseEntity.ok(dto);
    }
}
