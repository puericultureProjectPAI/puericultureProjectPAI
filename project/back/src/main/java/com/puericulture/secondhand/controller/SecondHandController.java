package com.puericulture.secondhand.controller;

import com.puericulture.secondhand.dto.SecondHandDto;
import com.puericulture.secondhand.dto.SecondHandListItemDto;
import com.puericulture.secondhand.dto.SecondHandRequest;
import com.puericulture.secondhand.service.SecondHandService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/second-hand")
public class SecondHandController {

    private final SecondHandService secondHandService;

    public SecondHandController(SecondHandService secondHandService) {
        this.secondHandService = secondHandService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SecondHandDto createSecondHand(
            @AuthenticationPrincipal String authenticatedPersonId,
            @Valid @RequestBody SecondHandRequest request) {
        return secondHandService.createSecondHand(request, UUID.fromString(authenticatedPersonId));
    }

    @GetMapping("/products")
    public ResponseEntity<List<SecondHandListItemDto>> getAllProducts() {
        return ResponseEntity.ok(secondHandService.getAllProducts());
    }
}
