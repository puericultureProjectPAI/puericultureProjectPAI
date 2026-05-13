package com.puericulture.troc.service;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final ProductTrocRepository productTrocRepository;

    private static final UUID MOCK_USER_ID =
            UUID.fromString(
                    "58de0ca9-e943-44e6-a790-0ea0b7be5f14"); // A rempacer par l'ID de l'utilisateur

    // connecté quand le front sera prêt

    public ExchangeService(
            ExchangeRepository exchangeRepository, ProductTrocRepository productTrocRepository) {
        this.exchangeRepository = exchangeRepository;
        this.productTrocRepository = productTrocRepository;
    }

    public ExchangeResponse createExchange(CreateExchangeRequest request) {

        ProductTroc proposerProduct =
                productTrocRepository
                        .findById(request.getProposerProductId())
                        .orElseThrow(() -> new NotFoundException("Proposer product not found"));

        ProductTroc receiverProduct =
                productTrocRepository
                        .findById(request.getReceiverProductId())
                        .orElseThrow(() -> new NotFoundException("Receiver product not found"));

        if (proposerProduct.getAuthor().equals(receiverProduct.getAuthor())) {
            throw new BadRequestException("Cannot exchange products from the same user");
        }

        boolean alreadyExists =
                exchangeRepository.existsByProposerProductIdAndReceiverProductId(
                        request.getProposerProductId(), request.getReceiverProductId());

        if (alreadyExists) {
            throw new BadRequestException("Exchange already exists");
        }

        if (!proposerProduct.getAuthor().getId().equals(MOCK_USER_ID)) {

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

    public List<ExchangeResponse> getExchangesProposedToConnectedUser() {
        // uniquement les échanges proposés à
        // l'utilisateur connecté
        return exchangeRepository.findAll().stream()
                .filter(
                        exchange -> {
                            ProductTroc receiverProduct =
                                    productTrocRepository
                                            .findById(exchange.getReceiverProductId())
                                            .orElse(null);
                            return receiverProduct != null
                                    && receiverProduct.getAuthor().getId().equals(MOCK_USER_ID);
                        })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void acceptExchange(Long exchangeId) {
        /*
        uniquement les échanges proposés à l'utilisateur connecté et qui sont en statut PENDING,
        les autres échanges proposés sur les produits concernés sont automatiquement refusés
        et les produits concernés sont marqués comme échangés   */

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        if (!exchange.getStatus().equals(ExchangeStatus.PENDING)) {
            throw new BadRequestException("Only pending exchanges can be accepted");
        }

        ProductTroc receiverProduct =
                productTrocRepository
                        .findById(exchange.getReceiverProductId())
                        .orElseThrow(() -> new NotFoundException("Receiver product not found"));

        if (!receiverProduct.getAuthor().getId().equals(MOCK_USER_ID)) {
            throw new ForbiddenException("You can only accept exchanges proposed to you");
        }

        exchange.setStatus(ExchangeStatus.CONFIRMED);
        exchangeRepository.save(exchange);
    }

    public void refuseExchange(Long exchangeId) {
        /*
        uniquement les échanges proposés à l'utilisateur connecté et qui sont en statut PENDING,
        les autres échanges proposés sur les produits concernés sont automatiquement refusés
        et les produits concernés sont marqués comme refusés   */

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        if (!exchange.getStatus().equals(ExchangeStatus.PENDING)) {
            throw new BadRequestException("Only pending exchanges can be refused");
        }

        ProductTroc receiverProduct =
                productTrocRepository
                        .findById(exchange.getReceiverProductId())
                        .orElseThrow(() -> new NotFoundException("Receiver product not found"));

        if (!receiverProduct.getAuthor().getId().equals(MOCK_USER_ID)) {
            throw new ForbiddenException("You can only refuse exchanges proposed to you");
        }

        exchange.setStatus(ExchangeStatus.REFUSED);
        exchangeRepository.save(exchange);
    }

    public List<ExchangeResponse> getExchangesProposedToConnectedUserForProduct(
            Long productId) { // uniquement les échanges proposés à l'utilisateur connecté pour
        // un produit donné
        ProductTroc product =
                productTrocRepository
                        .findById(productId)
                        .orElseThrow(() -> new NotFoundException("Product not found"));

        if (!product.getAuthor().getId().equals(MOCK_USER_ID)) {
            throw new ForbiddenException(
                    "You can only view exchanges proposed to your own products");
        }

        return exchangeRepository.findAll().stream()
                .filter(exchange -> exchange.getReceiverProductId().equals(productId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
