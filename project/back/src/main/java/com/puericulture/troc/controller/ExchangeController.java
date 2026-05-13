package com.puericulture.troc.controller;

import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.service.ExchangeService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/troc/exchanges")
public class ExchangeController {

    private final ExchangeService exchangeService;

    public ExchangeController(ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExchangeResponse createExchange(@RequestBody CreateExchangeRequest request) {

        return exchangeService.createExchange(request);
    }

    @DeleteMapping("/{exchangeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExchange(@PathVariable Long exchangeId) {

        exchangeService.deleteExchange(exchangeId);
    }

    @GetMapping("/my-exchanges")
    public List<ExchangeResponse> getAllExchanges() {
        return exchangeService.getAllExchanges();
    }

    @GetMapping("/proposed-to-me")
    public List<ExchangeResponse> getExchangesProposedToConnectedUser() {
        return exchangeService.getExchangesProposedToConnectedUser();
    }

    @PostMapping("/{exchangeId}/confirmed")
    public void confirmExchange(@PathVariable Long exchangeId) {
        exchangeService.acceptExchange(exchangeId);
    }

    @PostMapping("/{exchangeId}/refused")
    public void refuseExchange(@PathVariable Long exchangeId) {
        exchangeService.refuseExchange(exchangeId);
    }

    @GetMapping("/proposed-to-me/{productId}")
    public List<ExchangeResponse> getExchangesProposedToConnectedUserForProduct(
            @PathVariable Long productId) {
        return exchangeService.getExchangesProposedToConnectedUserForProduct(productId);
    }
}
