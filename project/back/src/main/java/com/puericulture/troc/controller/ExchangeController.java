package com.puericulture.troc.controller;

import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductExchangeStatusResponse;
import com.puericulture.troc.service.ExchangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/troc/exchanges")
@RequiredArgsConstructor
@Tag(
        name = "Product Exchanges(TROC)",
        description = "Endpoints allowing users to create and manage product exchange proposals.")
public class ExchangeController {

    private final ExchangeService exchangeService;

    @Operation(
            summary = "Create a new exchange proposal",
            description =
                    "Allows a user to propose an exchange between their own product and another user's product.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Exchange successfully created.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ExchangeResponse.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid exchange request or exchange already exists."),
                @ApiResponse(
                        responseCode = "403",
                        description = "User attempted to exchange a product they do not own."),
                @ApiResponse(responseCode = "404", description = "Product not found.")
            })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExchangeResponse createExchange(@RequestBody CreateExchangeRequest request) {

        return exchangeService.createExchange(request);
    }

    @Operation(
            summary = "Delete an exchange",
            description = "Allows the creator of an exchange proposal to delete it.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "204", description = "Exchange deleted successfully."),
                @ApiResponse(
                        responseCode = "403",
                        description = "User attempted to delete an exchange they do not own."),
                @ApiResponse(responseCode = "404", description = "Exchange not found.")
            })
    @DeleteMapping("/{exchangeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExchange(@PathVariable Long exchangeId) {

        exchangeService.deleteExchange(exchangeId);
    }

    @Operation(
            summary = "Get my exchanges",
            description = "Returns all exchanges created by the connected user.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Exchanges successfully retrieved.")
            })
    @GetMapping("/my-exchanges")
    public List<ExchangeResponse> getAllExchanges() {

        return exchangeService.getAllExchanges();
    }

    @Operation(
            summary = "Get exchanges proposed to me",
            description = "Returns all exchanges targeting products owned by the connected user.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Incoming exchanges successfully retrieved.")
            })
    @GetMapping("/proposed-to-me")
    public List<ExchangeResponse> getExchangesProposedToConnectedUser() {

        return exchangeService.getExchangesProposedToConnectedUser();
    }

    @Operation(
            summary = "Accept an exchange",
            description =
                    "Moves an exchange from PENDING to ACCEPTED. This represents the beginning of the negotiation phase through chat. All other pending exchanges involving the same products are automatically refused.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Exchange accepted successfully."),
                @ApiResponse(
                        responseCode = "400",
                        description = "Only pending exchanges can be accepted."),
                @ApiResponse(
                        responseCode = "403",
                        description = "User attempted to accept an exchange not proposed to them."),
                @ApiResponse(responseCode = "404", description = "Exchange not found.")
            })
    @PostMapping("/{exchangeId}/accepted")
    public void acceptExchange(@PathVariable Long exchangeId) {

        exchangeService.acceptExchange(exchangeId);
    }

    @Operation(
            summary = "Confirm an exchange after negotiation",
            description =
                    "Final validation step after the negotiation/chat phase. Moves an exchange from ACCEPTED to CONFIRMED and permanently closes both products.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Exchange confirmed successfully."),
                @ApiResponse(
                        responseCode = "400",
                        description = "Only accepted exchanges can be confirmed."),
                @ApiResponse(
                        responseCode = "403",
                        description =
                                "User attempted to confirm an exchange not proposed to them."),
                @ApiResponse(responseCode = "404", description = "Exchange not found.")
            })
    @PostMapping("/{exchangeId}/confirm")
    public void confirmExchange(@PathVariable Long exchangeId) {

        exchangeService.confirmExchange(exchangeId);
    }

    @Operation(
            summary = "Refuse an exchange",
            description =
                    "Allows the owner of the requested product to refuse an exchange proposal during the pending or negotiation phase.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Exchange refused successfully."),
                @ApiResponse(
                        responseCode = "400",
                        description = "Only pending or accepted exchanges can be refused."),
                @ApiResponse(
                        responseCode = "403",
                        description = "User attempted to refuse an exchange not proposed to them."),
                @ApiResponse(responseCode = "404", description = "Exchange not found.")
            })
    @PostMapping("/{exchangeId}/refused")
    public void refuseExchange(@PathVariable Long exchangeId) {

        exchangeService.refuseExchange(exchangeId);
    }

    @Operation(
            summary = "Get exchanges for a product",
            description =
                    "Returns all exchange proposals targeting a specific product owned by the connected user.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Exchange list successfully retrieved."),
                @ApiResponse(
                        responseCode = "403",
                        description =
                                "User attempted to access exchanges for a product they do not own."),
                @ApiResponse(responseCode = "404", description = "Product not found.")
            })
    @GetMapping("/product/proposed-to-me/{productId}")
    public List<ExchangeResponse> getExchangesProposedToConnectedUserForProduct(
            @PathVariable Long productId) {

        return exchangeService.getExchangesProposedToConnectedUserForProduct(productId);
    }

    @Operation(
            summary = "Check exchange status for a product",
            description =
                    "Allows a user to verify whether they already proposed an exchange for a product and retrieve its status.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Exchange status successfully retrieved.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        implementation =
                                                                ProductExchangeStatusResponse
                                                                        .class))),
                @ApiResponse(
                        responseCode = "403",
                        description = "User attempted to check their own product."),
                @ApiResponse(responseCode = "404", description = "Product not found.")
            })
    @GetMapping("/product/{productId}/status")
    public ResponseEntity<ProductExchangeStatusResponse> getExchangeStatusForProduct(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                exchangeService.getIfIHaveProposedExchangeForSomeonesProduct(productId));
    }
}
