package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.service.ProductTrocService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "User Products", description = "Endpoints to access current user's products")
public class UserProductsController {

    private final ProductTrocService productTrocService;

    @Operation(
            summary = "Get my available products",
            description =
                    "Returns troc products created by the authenticated user and still available")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Products retrieved")})
    @GetMapping("/my-available")
    public ResponseEntity<List<ProductTrocDto>> getMyAvailableProducts(
            @AuthenticationPrincipal String authenticatedPersonId) {

        UUID authorId = UUID.fromString(authenticatedPersonId);
        List<ProductTrocDto> list = productTrocService.findMyAvailableProducts(authorId);
        return ResponseEntity.ok(list);
    }
}
