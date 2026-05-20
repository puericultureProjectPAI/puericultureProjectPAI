package com.puericulture.troc;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.puericulture.troc.controller.ExchangeController;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductExchangeStatusResponse;
import com.puericulture.troc.service.ExchangeService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExchangeControllerTest {

    @Mock private ExchangeService exchangeService;

    private ExchangeController exchangeController;
    private static final UUID MOCK_USER_ID =
            UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");

    @BeforeEach
    void setUp() {
        // Initialize the controller with a mocked service dependency.
        exchangeController = new ExchangeController(exchangeService);
    }

    @Test
    void shouldCallServiceWhenCreatingExchange() {
        CreateExchangeRequest request = new CreateExchangeRequest();
        ExchangeResponse expectedResponse = new ExchangeResponse();

        when(exchangeService.createExchange(request, MOCK_USER_ID)).thenReturn(expectedResponse);

        ExchangeResponse result =
                exchangeController.createExchange(MOCK_USER_ID.toString(), request);

        assertSame(
                expectedResponse,
                result,
                "Controller should return the exact response from the service");
        verify(exchangeService).createExchange(request, MOCK_USER_ID);
    }

    @Test
    void shouldCallServiceWhenDeletingExchange() {
        long exchangeId = 42L;

        exchangeController.deleteExchange(MOCK_USER_ID.toString(), exchangeId);

        verify(exchangeService).deleteExchange(exchangeId, MOCK_USER_ID);
    }

    @Test
    void shouldReturnAllExchangesForCurrentUser() {
        List<ExchangeResponse> expectedList = List.of(new ExchangeResponse());

        when(exchangeService.getAllExchanges(MOCK_USER_ID)).thenReturn(expectedList);

        List<ExchangeResponse> result = exchangeController.getAllExchanges(MOCK_USER_ID.toString());

        assertEquals(expectedList, result, "Controller should return the list from the service");
        verify(exchangeService).getAllExchanges(MOCK_USER_ID);
    }

    @Test
    void shouldReturnExchangesProposedToConnectedUser() {
        List<ExchangeResponse> expectedList = List.of(new ExchangeResponse());

        when(exchangeService.getExchangesProposedToConnectedUser(MOCK_USER_ID))
                .thenReturn(expectedList);

        List<ExchangeResponse> result =
                exchangeController.getExchangesProposedToConnectedUser(MOCK_USER_ID.toString());

        assertEquals(expectedList, result);
        verify(exchangeService).getExchangesProposedToConnectedUser(MOCK_USER_ID);
    }

    @Test
    void shouldCallServiceWhenAcceptingExchange() {
        long exchangeId = 10L;

        exchangeController.acceptExchange(MOCK_USER_ID.toString(), exchangeId);

        verify(exchangeService).acceptExchange(exchangeId, MOCK_USER_ID);
    }

    @Test
    void shouldCallServiceWhenConfirmingExchange() {
        long exchangeId = 11L;

        exchangeController.confirmExchange(MOCK_USER_ID.toString(), exchangeId);

        verify(exchangeService).confirmExchange(exchangeId, MOCK_USER_ID);
    }

    @Test
    void shouldCallServiceWhenRefusingExchange() {
        long exchangeId = 12L;

        exchangeController.refuseExchange(MOCK_USER_ID.toString(), exchangeId);

        verify(exchangeService).refuseExchange(exchangeId, MOCK_USER_ID);
    }

    @Test
    void shouldReturnExchangesForProduct() {
        long productId = 23L;
        List<ExchangeResponse> expectedList = List.of(new ExchangeResponse());

        when(exchangeService.getExchangesProposedToConnectedUserForProduct(productId, MOCK_USER_ID))
                .thenReturn(expectedList);

        List<ExchangeResponse> result =
                exchangeController.getExchangesProposedToConnectedUserForProduct(
                        MOCK_USER_ID.toString(), productId);

        assertEquals(expectedList, result);
        verify(exchangeService)
                .getExchangesProposedToConnectedUserForProduct(productId, MOCK_USER_ID);
    }

    @Test
    void shouldReturnExchangeStatusForProduct() {
        long productId = 99L;
        ProductExchangeStatusResponse expectedStatus = new ProductExchangeStatusResponse();

        when(exchangeService.getIfIHaveProposedExchangeForSomeonesProduct(productId, MOCK_USER_ID))
                .thenReturn(expectedStatus);

        var responseEntity =
                exchangeController.getExchangeStatusForProduct(MOCK_USER_ID.toString(), productId);

        assertEquals(200, responseEntity.getStatusCodeValue());
        assertSame(expectedStatus, responseEntity.getBody());
        verify(exchangeService)
                .getIfIHaveProposedExchangeForSomeonesProduct(productId, MOCK_USER_ID);
    }
}
