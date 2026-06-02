package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingArticleDetailDto;
import com.puericulture.leasing.service.LeasingArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Leasing", description = "Endpoints for leasing operations")
public class LeasingController {

    private final LeasingArticleService leasingArticleService;

    @Operation(
            summary = "Get leasing article details",
            description = "Retrieves the detailed information of a leasing article by its ID")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Article found and returned successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                LeasingArticleDetailDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Leasing article not found",
                        content = @Content(mediaType = "application/json"))
            })
    @GetMapping("/public/leasing/articles/{id}")
    public ResponseEntity<LeasingArticleDetailDto> getArticleDetail(@PathVariable Long id) {
        return ResponseEntity.ok(leasingArticleService.getArticleDetail(id));
    }
}
