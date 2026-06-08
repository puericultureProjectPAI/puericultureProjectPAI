package com.puericulture.troc.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.puericulture.troc.dto.ConditionAnalysisResponse;
import com.puericulture.troc.service.ProductConditionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ProductConditionControllerTest {

    @Mock private ProductConditionService conditionService;

    private ProductConditionController controller;

    private static final String VALID_IMAGE_URL =
            "https://res.cloudinary.com/demo/image/upload/sample.jpg";

    @BeforeEach
    void setUp() {
        controller = new ProductConditionController(conditionService);
    }

    @Test
    void evaluateCondition_validUrl_returns200WithCondition() {
        ConditionAnalysisResponse expected =
                ConditionAnalysisResponse.builder()
                        .condition("Bon état")
                        .confidenceScore(78)
                        .multipleItemsDetected(false)
                        .build();
        when(conditionService.analyzeCondition(VALID_IMAGE_URL)).thenReturn(expected);

        ResponseEntity<ConditionAnalysisResponse> response =
                controller.evaluateCondition(VALID_IMAGE_URL);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(expected, response.getBody());
        verify(conditionService).analyzeCondition(VALID_IMAGE_URL);
    }

    @Test
    void evaluateCondition_blankUrl_returns400WithoutCallingService() {
        ResponseEntity<ConditionAnalysisResponse> response = controller.evaluateCondition("   ");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verifyNoInteractions(conditionService);
    }

    @Test
    void evaluateCondition_emptyUrl_returns400WithoutCallingService() {
        ResponseEntity<ConditionAnalysisResponse> response = controller.evaluateCondition("");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verifyNoInteractions(conditionService);
    }

    @Test
    void evaluateCondition_serviceUnavailable_propagates503() {
        when(conditionService.analyzeCondition(VALID_IMAGE_URL))
                .thenThrow(
                        new ResponseStatusException(
                                HttpStatus.SERVICE_UNAVAILABLE,
                                "AI service currently unavailable"));

        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> controller.evaluateCondition(VALID_IMAGE_URL));

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
    }
}
