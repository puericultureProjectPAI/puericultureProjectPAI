package com.puericulture.troc.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.puericulture.common.entity.Person;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import com.puericulture.troc.mapper.ExchangeMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.MessageRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExchangeServiceTest {

    @Mock private ExchangeRepository exchangeRepository;

    @Mock private ProductTrocRepository productTrocRepository;

    @Mock private ExchangeMapper exchangeMapper;

    @Mock private MessageRepository messageRepository;

    @InjectMocks private ExchangeService exchangeService;

    private static final UUID MOCK_USER_ID =
            UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");

    private ProductTroc proposerProduct;
    private ProductTroc receiverProduct;

    @BeforeEach
    void setup() {

        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        Person otherUser = new Person();
        otherUser.setId(UUID.randomUUID());

        proposerProduct = new ProductTroc();
        proposerProduct.setId(1L);
        proposerProduct.setAuthor(connectedUser);
        proposerProduct.setStatus(ProductTrocStatus.AVAILABLE);

        receiverProduct = new ProductTroc();
        receiverProduct.setId(2L);
        receiverProduct.setAuthor(otherUser);
        receiverProduct.setStatus(ProductTrocStatus.AVAILABLE);
    }

    @Test
    void shouldCreateExchangeSuccessfully() {

        CreateExchangeRequest request = new CreateExchangeRequest();

        request.setProposerProduct(proposerProduct);
        request.setReceiverProduct(receiverProduct);

        when(productTrocRepository.findById(1L)).thenReturn(Optional.of(proposerProduct));

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        when(exchangeRepository.existsByProposerProductAndReceiverProduct(
                        proposerProduct, receiverProduct))
                .thenReturn(false);

        Exchange exchange = new Exchange();

        exchange.setProposerProduct(proposerProduct);
        exchange.setReceiverProduct(receiverProduct);
        exchange.setStatus(ExchangeStatus.PENDING);

        ExchangeResponse response = new ExchangeResponse();

        response.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.save(any(Exchange.class))).thenReturn(exchange);

        when(exchangeMapper.toResponse(any(Exchange.class))).thenReturn(response);

        ExchangeResponse result = exchangeService.createExchange(request, MOCK_USER_ID);

        assertEquals(ExchangeStatus.PENDING, result.getStatus());

        assertEquals(ProductTrocStatus.AVAILABLE, proposerProduct.getStatus());

        assertEquals(ProductTrocStatus.AVAILABLE, receiverProduct.getStatus());
    }

    @Test
    void shouldAcceptExchangeSuccessfully() {

        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        receiverProduct.setAuthor(connectedUser);

        Exchange exchange = new Exchange();

        exchange.setId(1L);
        exchange.setProposerProduct(proposerProduct);
        exchange.setReceiverProduct(receiverProduct);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        when(exchangeRepository.findConflictingPendingExchanges(ExchangeStatus.PENDING, 1L, 1L, 2L))
                .thenReturn(List.of());

        exchangeService.acceptExchange(1L, MOCK_USER_ID);

        assertEquals(ExchangeStatus.ACCEPTED, exchange.getStatus());

        assertEquals(ProductTrocStatus.PENDING, proposerProduct.getStatus());

        assertEquals(ProductTrocStatus.PENDING, receiverProduct.getStatus());
    }

    @Test
    void shouldConfirmExchangeSuccessfully() {

        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        receiverProduct.setAuthor(connectedUser);

        Exchange exchange = new Exchange();

        exchange.setProposerProduct(proposerProduct);
        exchange.setReceiverProduct(receiverProduct);
        exchange.setStatus(ExchangeStatus.ACCEPTED);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        exchangeService.confirmExchange(1L, MOCK_USER_ID);

        assertEquals(ExchangeStatus.CONFIRMED, exchange.getStatus());

        assertEquals(ProductTrocStatus.CLOSED, proposerProduct.getStatus());

        assertEquals(ProductTrocStatus.CLOSED, receiverProduct.getStatus());
    }

    @Test
    void shouldRefuseExchangeSuccessfully() {

        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        receiverProduct.setAuthor(connectedUser);

        proposerProduct.setStatus(ProductTrocStatus.PENDING);
        receiverProduct.setStatus(ProductTrocStatus.PENDING);

        Exchange exchange = new Exchange();

        exchange.setProposerProduct(proposerProduct);
        exchange.setReceiverProduct(receiverProduct);
        exchange.setStatus(ExchangeStatus.ACCEPTED);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        exchangeService.refuseExchange(1L, MOCK_USER_ID);

        assertEquals(ExchangeStatus.REFUSED, exchange.getStatus());

        assertEquals(ProductTrocStatus.AVAILABLE, proposerProduct.getStatus());

        assertEquals(ProductTrocStatus.AVAILABLE, receiverProduct.getStatus());
    }
}
