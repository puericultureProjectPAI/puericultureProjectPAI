package com.puericulture.troc.controller;

import com.puericulture.troc.dto.TrocProductCreateRequest;
import com.puericulture.troc.dto.TrocProductDto;
import com.puericulture.troc.service.TrocProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/troc/products")
@Tag(name = "Troc Products", description = "Create and retrieve troc product listings")
public class TrocProductController {

    private final TrocProductService trocProductService;

    @Autowired
    public TrocProductController(TrocProductService trocProductService) {
        this.trocProductService = trocProductService;
    }

    @Operation(
            summary = "Create a troc product listing",
            description =
                    "Creates a new product listing for troc. The authenticated user becomes the author. "
                            + "After creation, associate images via POST /api/troc/images.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Troc product created successfully.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = TrocProductDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Authenticated user not found.",
                        content = @Content(mediaType = "application/json"))
            })
    @PostMapping
    public ResponseEntity<TrocProductDto> create(
            @RequestBody TrocProductCreateRequest request,
            @AuthenticationPrincipal String authorId) {
        return ResponseEntity.ok(trocProductService.create(request, authorId));
    }

    @Operation(
            summary = "Get a troc product by ID",
            description = "Returns the troc product listing with the given ID.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Troc product retrieved successfully.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = TrocProductDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Troc product not found.",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/{id}")
    public ResponseEntity<TrocProductDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(trocProductService.getById(id));
    }
}
