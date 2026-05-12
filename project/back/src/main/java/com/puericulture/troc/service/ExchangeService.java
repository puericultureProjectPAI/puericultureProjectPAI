package com.puericulture.troc.service;

import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.repository.ExchangeRepository;
import org.springframework.stereotype.Service;

@Service
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;

    public ExchangeService(ExchangeRepository exchangeRepository) {
        this.exchangeRepository = exchangeRepository;
    }

    public ExchangeResponse createExchange(CreateExchangeRequest request) {

        Exchange exchange = new Exchange();

        exchange.setProposerProductId(request.getProposerProductId());
        exchange.setReceiverProductId(request.getReceiverProductId());

        exchange.setStatus(ExchangeStatus.PENDING);

        Exchange savedExchange = exchangeRepository.save(exchange);

        return mapToResponse(savedExchange);
    }

    private ExchangeResponse mapToResponse(Exchange exchange) {

        ExchangeResponse response = new ExchangeResponse();

        response.setId(exchange.getId());
        response.setProposerProductId(exchange.getProposerProductId());
        response.setReceiverProductId(exchange.getReceiverProductId());
        response.setStatus(exchange.getStatus());
        response.setCreatedAt(exchange.getCreatedAt());

        return response;
    }
}
