package com.puericulture.troc.controller;

import com.puericulture.troc.dto.CreateTriangularExchangeRequest;
import com.puericulture.troc.dto.TriangularExchangeResponse;
import com.puericulture.troc.service.TriangularExchangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/troc/triangular-exchanges")
@RequiredArgsConstructor
@Tag(
        name = "Triangular Product Exchanges (TROC 3-Way)",
        description =
                "Endpoints permettant de proposer et de gérer des cycles d'échanges triangulaires entre 3 utilisateurs.")
@CrossOrigin(origins = "http://localhost:5173")
public class TriangularExchangeController {

    private final TriangularExchangeService triangularExchangeService;

    @Operation(
            summary = "Proposer un nouvel échange triangulaire",
            description =
                    "Initialise une boucle de troc à 3 participants. L'utilisateur connecté doit obligatoirement faire partie du cycle proposé.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Échange triangulaire créé avec succès.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                TriangularExchangeResponse.class))),
                @ApiResponse(
                        responseCode = "400",
                        description =
                                "Requête invalide ou un des produits est déjà indisponible (PENDING/CLOSED)."),
                @ApiResponse(
                        responseCode = "403",
                        description =
                                "L'utilisateur connecté a tenté de créer un cycle dans lequel il n'est pas impliqué."),
                @ApiResponse(
                        responseCode = "404",
                        description = "Un participant ou un produit spécifié n'existe pas.")
            })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TriangularExchangeResponse createTriangularExchange(
            @AuthenticationPrincipal String authenticatedPersonId,
            @RequestBody CreateTriangularExchangeRequest request) {

        return triangularExchangeService.createTriangularExchange(
                request, UUID.fromString(authenticatedPersonId));
    }

    @Operation(
            summary = "Accepter une proposition d'échange triangulaire",
            description =
                    "Enregistre le vote positif du participant connecté. Si c'est le dernier vote manquant, la boucle passe au statut ACCEPTED et bloque automatiquement les 3 articles en bloquant les propositions simples concurrentes.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Proposition acceptée avec succès."),
                @ApiResponse(
                        responseCode = "400",
                        description =
                                "L'échange n'est plus en attente (PENDING) ou l'utilisateur a déjà voté."),
                @ApiResponse(
                        responseCode = "403",
                        description =
                                "L'utilisateur connecté ne fait pas partie des participants de cet échange."),
                @ApiResponse(
                        responseCode = "404",
                        description = "Échange triangulaire introuvable.")
            })
    @PostMapping("/{exchangeId}/accept")
    public void acceptTriangularExchange(
            @AuthenticationPrincipal String authenticatedPersonId, @PathVariable Long exchangeId) {

        triangularExchangeService.acceptTriangularExchange(
                exchangeId, UUID.fromString(authenticatedPersonId));
    }

    @Operation(
            summary = "Refuser ou Annuler un échange triangulaire",
            description =
                    "Permet à n'importe quel participant de refuser la proposition (pendant la phase PENDING) ou d'annuler le troc (pendant la phase de négociation ACCEPTED). Entraîne un effet domino qui annule toute la boucle et libère les articles.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Échange triangulaire refusé/annulé avec succès."),
                @ApiResponse(
                        responseCode = "400",
                        description =
                                "Seuls les échanges PENDING ou ACCEPTED peuvent être refusés."),
                @ApiResponse(
                        responseCode = "403",
                        description =
                                "L'utilisateur connecté n'a pas le droit d'annuler cet échange."),
                @ApiResponse(
                        responseCode = "404",
                        description = "Échange triangulaire introuvable.")
            })
    @PostMapping("/{exchangeId}/refuse")
    public void refuseTriangularExchange(
            @AuthenticationPrincipal String authenticatedPersonId, @PathVariable Long exchangeId) {

        triangularExchangeService.refuseTriangularExchange(
                exchangeId, UUID.fromString(authenticatedPersonId));
    }

    @Operation(
            summary = "Confirmer définitivement l'échange triangulaire",
            description =
                    "Étape finale de validation après la phase de discussion. Passe l'échange en statut CONFIRMED et clôture définitivement (CLOSED) les 3 annonces de la boucle.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Échange triangulaire clôturé et validé définitivement."),
                @ApiResponse(
                        responseCode = "400",
                        description =
                                "Seuls les échanges déjà acceptés par tout le monde (en négociation) peuvent être confirmés."),
                @ApiResponse(
                        responseCode = "403",
                        description =
                                "L'utilisateur connecté n'est pas autorisé à valider cet échange."),
                @ApiResponse(
                        responseCode = "404",
                        description = "Échange triangulaire introuvable.")
            })
    @PostMapping("/{exchangeId}/confirm")
    public void confirmTriangularExchange(
            @AuthenticationPrincipal String authenticatedPersonId, @PathVariable Long exchangeId) {

        triangularExchangeService.confirmTriangularExchange(
                exchangeId, UUID.fromString(authenticatedPersonId));
    }

    @PutMapping("/{exchangeId}/product")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Modifier l'article que je propose dans l'échange triangulaire")
    public void updateProposedProduct(
            @AuthenticationPrincipal String authenticatedPersonId,
            @PathVariable Long exchangeId,
            @RequestParam Long newProductId) {

        triangularExchangeService.updateProposedProduct(
                exchangeId, UUID.fromString(authenticatedPersonId), newProductId);
    }

    @Operation(
            summary = "Créer automatiquement un échange triangulaire (Algorithme)",
            description =
                    "L'utilisateur connecté choisit uniquement le produit désiré. L'algorithme cherche en base un produit correspondant chez lui ainsi qu'un troisième partenaire tiers pour fermer automatiquement la boucle de troc.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Boucle de troc trouvée et initialisée avec succès.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                TriangularExchangeResponse.class))),
                @ApiResponse(
                        responseCode = "404",
                        description =
                                "Aucun produit disponible similaire ou aucun troisième partenaire trouvé pour fermer le triangle de troc.")
            })
    @PostMapping(params = "wantedProductId")
    @ResponseStatus(HttpStatus.OK)
    public TriangularExchangeResponse autoCreateTriangularExchange(
            @AuthenticationPrincipal String authenticatedPersonId,
            @Parameter(
                            description =
                                    "ID du produit que l'utilisateur connecté souhaite acquérir",
                            required = true)
                    @RequestParam
                    Long wantedProductId) {

        return triangularExchangeService.autoCreateTriangularExchange(
                wantedProductId, UUID.fromString(authenticatedPersonId));
    }
}
