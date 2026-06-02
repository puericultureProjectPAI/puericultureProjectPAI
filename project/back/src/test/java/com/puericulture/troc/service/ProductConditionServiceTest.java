package com.puericulture.troc.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.puericulture.troc.dto.ConditionAnalysisResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.*;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ProductConditionServiceTest {

    @Mock private RestTemplate restTemplate;

    private ProductConditionService service;

    private static final String VALID_IMAGE_URL =
            "https://res.cloudinary.com/demo/image/upload/sample.jpg";

    @BeforeEach
    void setUp() {
        service = new ProductConditionService(restTemplate, new ObjectMapper());
        ReflectionTestUtils.setField(service, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(
                service,
                "apiUrl",
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent");
    }

    @Test
    void analyzeCondition_validResponse_returnsCondition() {
        String geminiResponse =
                buildGeminiResponse("{\"condition\": \"Bon état\", \"confidenceScore\": 78}");
        mockRestTemplate(geminiResponse);

        ConditionAnalysisResponse result = service.analyzeCondition(VALID_IMAGE_URL);

        assertThat(result.getCondition()).isEqualTo("Bon état");
        assertThat(result.getConfidenceScore()).isEqualTo(78);
    }

    @Test
    void analyzeCondition_insufficientQuality_returnsNullCondition() {
        String geminiResponse =
                buildGeminiResponse("{\"condition\": null, \"confidenceScore\": 0}");
        mockRestTemplate(geminiResponse);

        ConditionAnalysisResponse result = service.analyzeCondition(VALID_IMAGE_URL);

        assertThat(result.getCondition()).isNull();
        assertThat(result.getConfidenceScore()).isEqualTo(0);
    }

    @Test
    void analyzeCondition_unknownCondition_setsConditionToNull() {
        String geminiResponse =
                buildGeminiResponse("{\"condition\": \"Parfait\", \"confidenceScore\": 50}");
        mockRestTemplate(geminiResponse);

        ConditionAnalysisResponse result = service.analyzeCondition(VALID_IMAGE_URL);

        assertThat(result.getCondition()).isNull();
        assertThat(result.getConfidenceScore()).isEqualTo(0);
    }

    @Test
    void analyzeCondition_geminiServiceDown_throws503() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenThrow(new RuntimeException("Connection refused"));

        assertThatThrownBy(() -> service.analyzeCondition(VALID_IMAGE_URL))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
    }

    private void mockRestTemplate(String body) {
        ResponseEntity<String> mockResponse = new ResponseEntity<>(body, HttpStatus.OK);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(mockResponse);
    }

    private String buildGeminiResponse(String jsonContent) {
        return String.format(
                "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"%s\"}]}}]}",
                jsonContent.replace("\"", "\\\""));
    }
}
