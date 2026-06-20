package com.puericulture.leasing.controller;

import com.puericulture.config.errormanager.ErrorResponse;
import com.puericulture.leasing.dto.LeasingSecurityCheckRequestDto;
import com.puericulture.leasing.dto.LeasingSecurityCheckResponseDto;
import com.puericulture.leasing.service.LeasingSecurityCheckService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leasing")
@RequiredArgsConstructor
@Tag(
        name = "Leasing Security Check",
        description = "Endpoints for checking safety and suitability of leasing products using AI")
public class LeasingSecurityCheckController {

    private final LeasingSecurityCheckService leasingSecurityCheckService;

    @Operation(
            summary = "Vérifier la sécurité d'un article avec l'IA",
            description =
                    "Appelle l'IA pour évaluer si l'article est adapté et sans danger pour l'enfant de l'âge spécifié. "
                            + "Retourne un score de sécurité, un label qualitatif et 4 justifications courtes.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Analyse effectuée avec succès.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                LeasingSecurityCheckResponseDto
                                                                        .class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Requête invalide (champs obligatoires manquants).",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class))),
                @ApiResponse(
                        responseCode = "401",
                        description =
                                "Non autorisé (authentification JWT manquante ou incorrecte).",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Analyse indisponible pour le moment (erreur serveur ou IA).",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class)))
            })
    @PostMapping("/security-check")
    public ResponseEntity<LeasingSecurityCheckResponseDto> checkSecurity(
            @Valid @RequestBody LeasingSecurityCheckRequestDto requestDto) {
        return ResponseEntity.ok(leasingSecurityCheckService.checkSafety(requestDto));
    }
}
