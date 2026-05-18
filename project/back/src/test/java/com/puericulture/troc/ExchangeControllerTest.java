package com.puericulture.troc;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.puericulture.troc.controller.ExchangeController;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductExchangeStatusResponse;
import com.puericulture.troc.service.ExchangeService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExchangeControllerTest {

    @Mock private ExchangeService exchangeService;

    private ExchangeController exchangeController;

    @BeforeEach
    void setUp() {
        // Initialize the controller with a mocked service dependency.
        exchangeController = new ExchangeController(exchangeService);
    }

    @Test
    void shouldCallServiceWhenCreatingExchange() {
        CreateExchangeRequest request = new CreateExchangeRequest();
        ExchangeResponse expectedResponse = new ExchangeResponse();

        when(exchangeService.createExchange(request)).thenReturn(expectedResponse);

        ExchangeResponse result = exchangeController.createExchange(request);

        assertSame(
                expectedResponse,
                result,
                "Controller should return the exact response from the service");
        verify(exchangeService).createExchange(request);
    }

    @Test
    void shouldCallServiceWhenDeletingExchange() {
        long exchangeId = 42L;

        exchangeController.deleteExchange(exchangeId);

        verify(exchangeService).deleteExchange(exchangeId);
    }

    @Test
    void shouldReturnAllExchangesForCurrentUser() {
        List<ExchangeResponse> expectedList = List.of(new ExchangeResponse());

        when(exchangeService.getAllExchanges()).thenReturn(expectedList);

        List<ExchangeResponse> result = exchangeController.getAllExchanges();

        assertEquals(expectedList, result, "Controller should return the list from the service");
        verify(exchangeService).getAllExchanges();
    }

    @Test
    void shouldReturnExchangesProposedToConnectedUser() {
        List<ExchangeResponse> expectedList = List.of(new ExchangeResponse());

        when(exchangeService.getExchangesProposedToConnectedUser()).thenReturn(expectedList);

        List<ExchangeResponse> result = exchangeController.getExchangesProposedToConnectedUser();

        assertEquals(expectedList, result);
        verify(exchangeService).getExchangesProposedToConnectedUser();
    }

    @Test
    void shouldCallServiceWhenAcceptingExchange() {
        long exchangeId = 10L;

        exchangeController.acceptExchange(exchangeId);

        verify(exchangeService).acceptExchange(exchangeId);
    }

    @Test
    void shouldCallServiceWhenConfirmingExchange() {
        long exchangeId = 11L;

        exchangeController.confirmExchange(exchangeId);

        verify(exchangeService).confirmExchange(exchangeId);
    }

    @Test
    void shouldCallServiceWhenRefusingExchange() {
        long exchangeId = 12L;

        exchangeController.refuseExchange(exchangeId);

        verify(exchangeService).refuseExchange(exchangeId);
    }

    @Test
    void shouldReturnExchangesForProduct() {
        long productId = 23L;
        List<ExchangeResponse> expectedList = List.of(new ExchangeResponse());

        when(exchangeService.getExchangesProposedToConnectedUserForProduct(productId))
                .thenReturn(expectedList);

        List<ExchangeResponse> result =
                exchangeController.getExchangesProposedToConnectedUserForProduct(productId);

        assertEquals(expectedList, result);
        verify(exchangeService).getExchangesProposedToConnectedUserForProduct(productId);
    }

    @Test
    void shouldReturnExchangeStatusForProduct() {
        long productId = 99L;
        ProductExchangeStatusResponse expectedStatus = new ProductExchangeStatusResponse();

        when(exchangeService.getIfIHaveProposedExchangeForSomeonesProduct(productId))
                .thenReturn(expectedStatus);

        var responseEntity = exchangeController.getExchangeStatusForProduct(productId);

        assertEquals(200, responseEntity.getStatusCodeValue());
        assertSame(expectedStatus, responseEntity.getBody());
        verify(exchangeService).getIfIHaveProposedExchangeForSomeonesProduct(productId);
    }
}
