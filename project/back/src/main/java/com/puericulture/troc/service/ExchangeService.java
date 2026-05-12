package com.puericulture.troc.service;

import com.puericulture.troc.configuration.exception.ExchangeAlreadyExistsException;
import com.puericulture.troc.configuration.exception.InvalidExchangeException;
import com.puericulture.troc.configuration.exception.ProductNotFoundException;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.Product;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import org.springframework.stereotype.Service;

@Service
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final ProductRepository productRepository;
    private final ProductTrocRepository productTrocRepository;

    public ExchangeService(
            ExchangeRepository exchangeRepository,
            ProductRepository productRepository,
            ProductTrocRepository productTrocRepository) {
        this.exchangeRepository = exchangeRepository;
        this.productRepository = productRepository;
        this.productTrocRepository = productTrocRepository;
    }

    public ExchangeResponse createExchange(CreateExchangeRequest request) {

        Product proposerProduct =
                productRepository
                        .findById(request.getProposerProductId())
                        .orElseThrow(
                                () -> new ProductNotFoundException("Proposer product not found"));

        Product receiverProduct =
                productRepository
                        .findById(request.getReceiverProductId())
                        .orElseThrow(
                                () -> new ProductNotFoundException("Receiver product not found"));

        ProductTroc proposerTroc =
                productTrocRepository
                        .findById(request.getProposerProductId())
                        .orElseThrow(
                                () ->
                                        new ProductNotFoundException(
                                                "Proposer product is not a troc product"));

        ProductTroc receiverTroc =
                productTrocRepository
                        .findById(request.getReceiverProductId())
                        .orElseThrow(
                                () ->
                                        new ProductNotFoundException(
                                                "Receiver product is not a troc product"));

        if (proposerProduct.getAuthorId().equals(receiverProduct.getAuthorId())) {

            throw new InvalidExchangeException("Cannot exchange products from the same user");
        }

        boolean alreadyExists =
                exchangeRepository.existsByProposerProductIdAndReceiverProductId(
                        request.getProposerProductId(), request.getReceiverProductId());

        if (alreadyExists) {
            throw new ExchangeAlreadyExistsException("Exchange already exists");
        }

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
