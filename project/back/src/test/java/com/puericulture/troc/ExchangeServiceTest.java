// ExchangeServiceTest.java

package com.puericulture.troc;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.puericulture.common.entity.Person;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductExchangeStatusResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import com.puericulture.troc.service.ExchangeService;
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

        receiverProduct = new ProductTroc();
        receiverProduct.setId(2L);
        receiverProduct.setAuthor(otherUser);
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

        when(exchangeRepository.save(any(Exchange.class))).thenReturn(exchange);

        ExchangeResponse response = exchangeService.createExchange(request);

        assertNotNull(response);

        assertEquals(ExchangeStatus.PENDING, response.getStatus());

        verify(exchangeRepository, times(1)).save(any(Exchange.class));
    }

    @Test
    void shouldThrowWhenProductsBelongToSameUser() {

        receiverProduct.setAuthor(proposerProduct.getAuthor());

        CreateExchangeRequest request = new CreateExchangeRequest();

        request.setProposerProduct(proposerProduct);
        request.setReceiverProduct(receiverProduct);

        when(productTrocRepository.findById(1L)).thenReturn(Optional.of(proposerProduct));

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        assertThrows(BadRequestException.class, () -> exchangeService.createExchange(request));
    }

    @Test
    void shouldDeleteExchangeSuccessfully() {

        Exchange exchange = new Exchange();
        exchange.setCreatorId(MOCK_USER_ID);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        exchangeService.deleteExchange(1L);

        verify(exchangeRepository, times(1)).delete(exchange);
    }

    @Test
    void shouldThrowWhenDeletingExchangeNotOwnedByUser() {

        Exchange exchange = new Exchange();
        exchange.setCreatorId(UUID.randomUUID());

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        assertThrows(ForbiddenException.class, () -> exchangeService.deleteExchange(1L));
    }

    @Test
    void shouldAcceptExchangeSuccessfully() {

        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        receiverProduct.setAuthor(connectedUser);

        Exchange exchange = new Exchange();
        exchange.setReceiverProduct(receiverProduct);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        exchangeService.acceptExchange(1L);

        assertEquals(ExchangeStatus.CONFIRMED, exchange.getStatus());

        verify(exchangeRepository, times(1)).save(exchange);
    }

    @Test
    void shouldRefuseExchangeSuccessfully() {

        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        receiverProduct.setAuthor(connectedUser);

        Exchange exchange = new Exchange();
        exchange.setReceiverProduct(receiverProduct);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        exchangeService.refuseExchange(1L);

        assertEquals(ExchangeStatus.REFUSED, exchange.getStatus());

        verify(exchangeRepository, times(1)).save(exchange);
    }

    @Test
    void shouldReturnExchangeForConnectedUserOnProduct() {

        Exchange exchange = new Exchange();
        exchange.setReceiverProduct(receiverProduct);
        exchange.setProposerProduct(proposerProduct);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        when(exchangeRepository.findByReceiverProduct(receiverProduct))
                .thenReturn(List.of(exchange));

        ProductExchangeStatusResponse response =
                exchangeService.getIfIHaveProposedExchangeForSomeonesProduct(2L);

        assertTrue(response.isHasExchange());

        assertEquals(ExchangeStatus.PENDING, response.getStatus());
    }

    @Test
    void shouldReturnFalseWhenNoExchangeExistsForConnectedUser() {

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        when(exchangeRepository.findByReceiverProduct(receiverProduct)).thenReturn(List.of());

        ProductExchangeStatusResponse response =
                exchangeService.getIfIHaveProposedExchangeForSomeonesProduct(2L);

        assertFalse(response.isHasExchange());
    }
}
