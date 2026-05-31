package com.puericulture.troc.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.puericulture.troc.dto.TriangularExchangeResponse;
import com.puericulture.troc.service.TriangularExchangeService;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TriangularExchangeControllerTest {

    @Mock private TriangularExchangeService triangularExchangeService;

    private TriangularExchangeController triangularExchangeController;

    private static final UUID MOCK_USER_ID =
            UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");

    @BeforeEach
    void setUp() {
        // Initialisation directe du contrôleur sans charger Spring (Test unitaire pur)
        triangularExchangeController = new TriangularExchangeController(triangularExchangeService);
    }

    // ==========================================
    //  1. NOUVELLES FEATURES (MATCHING & UPDATE)
    // ==========================================

    @Test
    void shouldCallServiceWhenAutoCreatingTriangularExchange() {
        // Given
        long wantedProductId = 2L;
        TriangularExchangeResponse expectedResponse = new TriangularExchangeResponse();

        when(triangularExchangeService.autoCreateTriangularExchange(wantedProductId, MOCK_USER_ID))
                .thenReturn(expectedResponse);

        // When
        TriangularExchangeResponse result =
                triangularExchangeController.autoCreateTriangularExchange(
                        MOCK_USER_ID.toString(), wantedProductId);

        // Then
        assertSame(
                expectedResponse,
                result,
                "Le contrôleur doit retourner la réponse exacte du service");
        verify(triangularExchangeService)
                .autoCreateTriangularExchange(wantedProductId, MOCK_USER_ID);
    }

    @Test
    void shouldCallServiceWhenUpdatingProposedProduct() {
        // Given
        long exchangeId = 1L;
        long newProductId = 99L;

        // When
        triangularExchangeController.updateProposedProduct(
                MOCK_USER_ID.toString(), exchangeId, newProductId);

        // Then
        verify(triangularExchangeService)
                .updateProposedProduct(exchangeId, MOCK_USER_ID, newProductId);
    }

    // ==========================================
    //  2. FEATURES PRÉCÉDENTES (GÉRER L'ÉCHANGE)
    // ==========================================

    @Test
    void shouldCallServiceWhenAcceptingTriangularExchange() {
        // Given
        long exchangeId = 42L;

        // When
        triangularExchangeController.acceptTriangularExchange(MOCK_USER_ID.toString(), exchangeId);

        // Then
        verify(triangularExchangeService).acceptTriangularExchange(exchangeId, MOCK_USER_ID);
    }

    @Test
    void shouldCallServiceWhenRefusingTriangularExchange() {
        // Given
        long exchangeId = 43L;

        // When
        triangularExchangeController.refuseTriangularExchange(MOCK_USER_ID.toString(), exchangeId);

        // Then
        verify(triangularExchangeService).refuseTriangularExchange(exchangeId, MOCK_USER_ID);
    }
}
