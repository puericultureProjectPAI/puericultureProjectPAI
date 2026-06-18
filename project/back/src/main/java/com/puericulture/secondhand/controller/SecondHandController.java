package com.puericulture.secondhand.controller;

import com.puericulture.secondhand.dto.SecondHandDto;
import com.puericulture.secondhand.dto.SecondHandRequest;
import com.puericulture.secondhand.service.SecondHandService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/second-hand")
@Tag(name = "Second-Hand", description = "Endpoints for second-hand products")
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
}
