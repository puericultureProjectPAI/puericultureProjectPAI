package com.puericulture.troc.service;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductExchangeStatusResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.Message;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import com.puericulture.troc.mapper.ExchangeMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.MessageRepository;
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
    private final MessageRepository messageRepository;

    // private static final UUID MOCK_USER_ID =
    //         UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");

    public ExchangeService(
            ExchangeRepository exchangeRepository,
            ProductTrocRepository productTrocRepository,
            ExchangeMapper exchangeMapper,
            MessageRepository messageRepository) {

        this.exchangeRepository = exchangeRepository;
        this.productTrocRepository = productTrocRepository;
        this.exchangeMapper = exchangeMapper;
        this.messageRepository = messageRepository;
    }

    private void saveSystemMessage(Exchange exchange, String content) {
        Message msg = new Message();
        msg.setSender(exchange.getReceiverProduct().getAuthor());
        msg.setExchange(exchange);
        msg.setContent(content);
        messageRepository.save(msg);
    }

    public ExchangeResponse createExchange(
            CreateExchangeRequest request,
            UUID connectedUserId) { // the connected user proposes an exchange between one of their
        // products and another user's product

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

        if (!proposerProduct.getAuthor().getId().equals(connectedUserId)) {

            throw new ForbiddenException("You can only propose exchanges with your own product");
        }

        if (proposerProduct.getStatus() == ProductTrocStatus.CLOSED
                || receiverProduct.getStatus() == ProductTrocStatus.CLOSED) {

            throw new BadRequestException("One of the products is closed");
        }

        if (proposerProduct.getStatus() == ProductTrocStatus.PENDING
                || receiverProduct.getStatus() == ProductTrocStatus.PENDING) {

            throw new BadRequestException(
                    "One of the products is already involved in a pending exchange");
        }

        Exchange exchange = new Exchange();

        exchange.setProposerProduct(proposerProduct);
        exchange.setReceiverProduct(receiverProduct);
        exchange.setStatus(ExchangeStatus.PENDING);

        Exchange savedExchange = exchangeRepository.save(exchange);

        return exchangeMapper.toResponse(savedExchange);
    }

    public void deleteExchange(
            Long exchangeId,
            UUID connectedUserId) { // the connected user deletes an exchange proposal they
        // created, which deletes the

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        if (!exchange.getProposerProduct().getAuthor().getId().equals(connectedUserId)) {

            throw new ForbiddenException("You can only delete exchanges that you have created");
        }

        exchangeRepository.delete(exchange);
    }

    public List<ExchangeResponse> getAllExchanges(
            UUID connectedUserId) { // exchanges created by the connected user

        return exchangeRepository.findByProposerProductAuthorId(connectedUserId).stream()
                .map(exchangeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ExchangeResponse> getExchangesProposedToConnectedUser(
            UUID connectedUserId) { // exchanges targeting products owned by the
        // connected user

        return exchangeRepository.findByReceiverProductAuthorId(connectedUserId).stream()
                .map(exchangeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void acceptExchange(
            Long exchangeId,
            UUID connectedUserId) { // the owner of the requested product accepts an exchange
        // proposal

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        requireNotBlocked(exchange);

        if (!exchange.getStatus().equals(ExchangeStatus.PENDING)) {

            throw new BadRequestException("Only pending exchanges can be accepted");
        }

        if (!exchange.getReceiverProduct().getAuthor().getId().equals(connectedUserId)) {

            throw new ForbiddenException("You can only accept exchanges proposed to you");
        }

        exchange.setStatus(ExchangeStatus.ACCEPTED);

        exchange.getProposerProduct().setStatus(ProductTrocStatus.PENDING);

        exchange.getReceiverProduct().setStatus(ProductTrocStatus.PENDING);

        List<Exchange> conflictingExchanges =
                exchangeRepository.findConflictingPendingExchanges(
                        ExchangeStatus.PENDING,
                        exchange.getId(),
                        exchange.getProposerProduct().getId(),
                        exchange.getReceiverProduct().getId());

        refuseConflictingExchanges(conflictingExchanges);

        productTrocRepository.save(exchange.getProposerProduct());
        productTrocRepository.save(exchange.getReceiverProduct());

        exchangeRepository.save(exchange);
        saveSystemMessage(exchange, "✓ Échange accepté");
    }

    private void requireNotBlocked(Exchange exchange) {
        if (exchange.getStatus() == ExchangeStatus.BLOCKED) {
            throw new BadRequestException("Exchange is frozen due to an active report");
        }
    }

    /**
     * Sets all conflicting exchanges to REFUSED status and persists them
     *
     * @param conflictingExchanges list of exchanges to refuse
     */
    private void refuseConflictingExchanges(List<Exchange> conflictingExchanges) {
        for (Exchange conflictingExchange : conflictingExchanges) {
            conflictingExchange.setStatus(ExchangeStatus.REFUSED);
        }
        exchangeRepository.saveAll(conflictingExchanges);
    }

    public void confirmExchange(
            Long exchangeId,
            UUID connectedUserId) { // the owner of the requested product confirms an accepted
        // exchange proposal, which closes the exchange and both products

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        requireNotBlocked(exchange);

        if (!exchange.getStatus().equals(ExchangeStatus.ACCEPTED)) {

            throw new BadRequestException("Only accepted exchanges can be confirmed");
        }

        if (!exchange.getReceiverProduct().getAuthor().getId().equals(connectedUserId)) {

            throw new ForbiddenException("You can only confirm exchanges proposed to you");
        }

        exchange.setStatus(ExchangeStatus.CONFIRMED);

        exchange.getProposerProduct().setStatus(ProductTrocStatus.CLOSED);

        exchange.getReceiverProduct().setStatus(ProductTrocStatus.CLOSED);

        productTrocRepository.save(exchange.getProposerProduct());
        productTrocRepository.save(exchange.getReceiverProduct());

        exchangeRepository.save(exchange);
        saveSystemMessage(exchange, "✓ Échange terminé");
    }

    public void refuseExchange(
            Long exchangeId,
            UUID connectedUserId) { // the owner of the requested product refuses a pending or
        // accepted exchange proposal, which sets the exchange as refused
        // and makes both products available again if they are not
        // involved in any other pending or accepted exchange

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        requireNotBlocked(exchange);

        if (exchange.getStatus() != ExchangeStatus.PENDING
                && exchange.getStatus() != ExchangeStatus.ACCEPTED) {

            throw new BadRequestException("Only pending or accepted exchanges can be refused");
        }

        if (!exchange.getReceiverProduct().getAuthor().getId().equals(connectedUserId)) {

            throw new ForbiddenException("You can only refuse exchanges proposed to you");
        }

        exchange.setStatus(ExchangeStatus.REFUSED);

        if (exchange.getProposerProduct().getStatus() != ProductTrocStatus.AVAILABLE) { //
            exchange.getProposerProduct().setStatus(ProductTrocStatus.AVAILABLE);
        }

        if (exchange.getReceiverProduct().getStatus() != ProductTrocStatus.AVAILABLE) {
            exchange.getReceiverProduct().setStatus(ProductTrocStatus.AVAILABLE);
        }

        exchangeRepository.save(exchange);
        saveSystemMessage(exchange, "✗ Échange refusé");
    }

    public List<ExchangeResponse> getExchangesProposedToConnectedUserForProduct(
            Long productId,
            UUID connectedUserId) { // exchanges targeting a specific product owned by the
        // connected user

        ProductTroc product =
                productTrocRepository
                        .findById(productId)
                        .orElseThrow(() -> new NotFoundException("Product not found"));

        if (!product.getAuthor().getId().equals(connectedUserId)) {

            throw new ForbiddenException(
                    "You can only view exchanges proposed to your own products");
        }

        return exchangeRepository.findByReceiverProduct(product).stream()
                .map(exchangeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProductExchangeStatusResponse getIfIHaveProposedExchangeForSomeonesProduct(
            Long productId,
            UUID connectedUserId) { // allows a user to verify whether they already proposed an
        // exchange for a product and retrieve its status

        ProductTroc product =
                productTrocRepository
                        .findById(productId)
                        .orElseThrow(() -> new NotFoundException("Product not found"));

        if (product.getAuthor().getId().equals(connectedUserId)) {

            throw new ForbiddenException("You cannot check your own product");
        }

        Optional<Exchange> exchangeOptional =
                exchangeRepository.findByReceiverProductIdAndProposerProductAuthorId(
                        productId, connectedUserId);

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
