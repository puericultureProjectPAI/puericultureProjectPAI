package com.puericulture.troc.service;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.Product;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final ProductRepository productRepository;
    private final ProductTrocRepository productTrocRepository;

    private static final UUID MOCK_USER_ID =
            UUID.fromString(
                    "1f3ff789-5551-46c2-9836-b2d14b4da22e"); // A rempacer par l'ID de l'utilisateur

    // connecté quand le front sera prêt

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
                        .orElseThrow(() -> new NotFoundException("Proposer product not found"));

        Product receiverProduct =
                productRepository
                        .findById(request.getReceiverProductId())
                        .orElseThrow(() -> new NotFoundException("Receiver product not found"));

        ProductTroc proposerTroc =
                productTrocRepository
                        .findById(request.getProposerProductId())
                        .orElseThrow(
                                () ->
                                        new NotFoundException(
                                                "Proposer product is not a troc product"));

        ProductTroc receiverTroc =
                productTrocRepository
                        .findById(request.getReceiverProductId())
                        .orElseThrow(
                                () ->
                                        new NotFoundException(
                                                "Receiver product is not a troc product"));

        if (proposerProduct.getAuthorId().equals(receiverProduct.getAuthorId())) {

            throw new BadRequestException("Cannot exchange products from the same user");
        }

        boolean alreadyExists =
                exchangeRepository.existsByProposerProductIdAndReceiverProductId(
                        request.getProposerProductId(), request.getReceiverProductId());

        if (alreadyExists) {
            throw new BadRequestException("Exchange already exists");
        }

        if (!proposerProduct.getAuthorId().equals(MOCK_USER_ID)) {

            throw new ForbiddenException("You can only propose exchanges with your own product");
        }

        Exchange exchange = new Exchange();

        exchange.setProposerProductId(request.getProposerProductId());
        exchange.setReceiverProductId(request.getReceiverProductId());

        exchange.setStatus(ExchangeStatus.PENDING);

        exchange.setCreatorId(
                MOCK_USER_ID); // A remplacer par l'ID de l'utilisateur connecté quand le front sera
        // prêt

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

    public void deleteExchange(Long exchangeId) {
        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        if (!exchange.getCreatorId().equals(MOCK_USER_ID)) {

            throw new ForbiddenException("You can only delete exchanges that you have created");
        }

        exchangeRepository.delete(exchange);
    }

    public List<ExchangeResponse>
            getAllExchanges() { // uniquement les échanges créés par l'utilisateur connecté
        return exchangeRepository.findAll().stream()
                .filter(exchange -> exchange.getCreatorId().equals(MOCK_USER_ID))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
