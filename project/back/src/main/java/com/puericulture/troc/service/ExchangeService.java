// ExchangeService.java

package com.puericulture.troc.service;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductExchangeStatusResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import com.puericulture.troc.mapper.ExchangeMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final ProductTrocRepository productTrocRepository;
    private final ExchangeMapper exchangeMapper;

    private static final UUID MOCK_USER_ID =
            UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");

    public ExchangeService(
            ExchangeRepository exchangeRepository,
            ProductTrocRepository productTrocRepository,
            ExchangeMapper exchangeMapper) {

        this.exchangeRepository = exchangeRepository;
        this.productTrocRepository = productTrocRepository;
        this.exchangeMapper = exchangeMapper;
    }

    public ExchangeResponse createExchange(CreateExchangeRequest request) {

        ProductTroc proposerProduct =
                productTrocRepository
                        .findById(request.getProposerProduct().getId())
                        .orElseThrow(() -> new NotFoundException("Proposer product not found"));

        ProductTroc receiverProduct =
                productTrocRepository
                        .findById(request.getReceiverProduct().getId())
                        .orElseThrow(() -> new NotFoundException("Receiver product not found"));

        if (proposerProduct.getAuthor().equals(receiverProduct.getAuthor())) {

            throw new BadRequestException("Cannot exchange products from the same user");
        }

        boolean alreadyExists =
                exchangeRepository.existsByProposerProductAndReceiverProduct(
                        proposerProduct, receiverProduct);

        if (alreadyExists) {

            throw new BadRequestException("Exchange already exists");
        }

        if (!proposerProduct.getAuthor().getId().equals(MOCK_USER_ID)) {

            throw new ForbiddenException("You can only propose exchanges with your own product");
        }

        if (proposerProduct.getStatus() != ProductTrocStatus.AVAILABLE
                || receiverProduct.getStatus() != ProductTrocStatus.AVAILABLE) {

            throw new BadRequestException("One of the products is not available for exchange");
        }

        Exchange exchange = new Exchange();

        exchange.setProposerProduct(proposerProduct);
        exchange.setReceiverProduct(receiverProduct);
        exchange.setStatus(ExchangeStatus.PENDING);

        proposerProduct.setStatus(ProductTrocStatus.PENDING);
        receiverProduct.setStatus(ProductTrocStatus.PENDING);

        productTrocRepository.save(proposerProduct);
        productTrocRepository.save(receiverProduct);

        Exchange savedExchange = exchangeRepository.save(exchange);

        return exchangeMapper.toResponse(savedExchange);
    }

    public void deleteExchange(Long exchangeId) {

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        if (!exchange.getProposerProduct().getAuthor().getId().equals(MOCK_USER_ID)) {

            throw new ForbiddenException("You can only delete exchanges that you have created");
        }

        exchangeRepository.delete(exchange);
    }

    public List<ExchangeResponse> getAllExchanges() {

        return exchangeRepository.findByProposerProductAuthorId(MOCK_USER_ID).stream()
                .map(exchangeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ExchangeResponse> getExchangesProposedToConnectedUser() {

        return exchangeRepository.findByReceiverProductAuthorId(MOCK_USER_ID).stream()
                .map(exchangeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void acceptExchange(Long exchangeId) {

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        if (!exchange.getStatus().equals(ExchangeStatus.PENDING)) {

            throw new BadRequestException("Only pending exchanges can be accepted");
        }

        if (!exchange.getReceiverProduct().getAuthor().getId().equals(MOCK_USER_ID)) {

            throw new ForbiddenException("You can only accept exchanges proposed to you");
        }

        exchange.setStatus(ExchangeStatus.CONFIRMED);

        exchange.getProposerProduct().setStatus(ProductTrocStatus.CLOSED);
        exchange.getReceiverProduct().setStatus(ProductTrocStatus.CLOSED);

        productTrocRepository.save(exchange.getProposerProduct());
        productTrocRepository.save(exchange.getReceiverProduct());

        exchangeRepository.save(exchange);
    }

    public void refuseExchange(Long exchangeId) {

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        if (!exchange.getStatus().equals(ExchangeStatus.PENDING)) {

            throw new BadRequestException("Only pending exchanges can be refused");
        }

        if (!exchange.getReceiverProduct().getAuthor().getId().equals(MOCK_USER_ID)) {

            throw new ForbiddenException("You can only refuse exchanges proposed to you");
        }

        exchange.setStatus(ExchangeStatus.REFUSED);
        exchange.getProposerProduct().setStatus(ProductTrocStatus.AVAILABLE);
        exchange.getReceiverProduct().setStatus(ProductTrocStatus.AVAILABLE);

        productTrocRepository.save(exchange.getProposerProduct());
        productTrocRepository.save(exchange.getReceiverProduct());
        exchangeRepository.save(exchange);
    }

    public List<ExchangeResponse> getExchangesProposedToConnectedUserForProduct(Long productId) {

        ProductTroc product =
                productTrocRepository
                        .findById(productId)
                        .orElseThrow(() -> new NotFoundException("Product not found"));

        if (!product.getAuthor().getId().equals(MOCK_USER_ID)) {

            throw new ForbiddenException(
                    "You can only view exchanges proposed to your own products");
        }

        return exchangeRepository.findByReceiverProduct(product).stream()
                .map(exchangeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProductExchangeStatusResponse getIfIHaveProposedExchangeForSomeonesProduct(
            Long productId) {

        ProductTroc product =
                productTrocRepository
                        .findById(productId)
                        .orElseThrow(() -> new NotFoundException("Product not found"));

        if (product.getAuthor().getId().equals(MOCK_USER_ID)) {

            throw new ForbiddenException("You cannot check your own product");
        }

        Optional<Exchange> exchangeOptional =
                exchangeRepository.findByReceiverProductIdAndProposerProductAuthorId(
                        productId, MOCK_USER_ID);

        ProductExchangeStatusResponse response = new ProductExchangeStatusResponse();

        if (exchangeOptional.isPresent()) {

            Exchange exchange = exchangeOptional.get();

            response.setHasExchange(true);
            response.setExchangeId(exchange.getId());
            response.setStatus(exchange.getStatus());

        } else {

            response.setHasExchange(false);
        }

        return response;
    }
}
