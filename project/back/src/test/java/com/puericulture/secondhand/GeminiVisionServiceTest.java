package com.puericulture.secondhand;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.puericulture.secondhand.dto.ProductAnalysisResponse;
import com.puericulture.secondhand.service.GeminiVisionService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class GeminiVisionServiceTest {

    @Mock private RestTemplate restTemplate;

    @InjectMocks private GeminiVisionService geminiVisionService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(geminiVisionService, "apiKey", "test-api-key");
        geminiVisionService = new GeminiVisionService(restTemplate, new ObjectMapper());
        ReflectionTestUtils.setField(geminiVisionService, "apiKey", "test-api-key");
    }

    @Test
    void analyzeImages_shouldReturnValidResponse_whenGeminiReturnsValidJson() {
        String geminiResponse =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"title\\": \\"Poussette Joie\\", \\"description\\": \\"Belle poussette\\", \\"category\\": \\"Poussettes, porte-bébés et sièges auto\\", \\"confidenceScore\\": 85, \\"condition\\": \\"Bon état\\", \\"multipleItemsDetected\\": false}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponse, HttpStatus.OK));

        MultipartFile image =
                new MockMultipartFile("image", "test.jpg", "image/jpeg", "image".getBytes());

        ProductAnalysisResponse result = geminiVisionService.analyzeImages(List.of(image));

        assertThat(result.getTitle()).isEqualTo("Poussette Joie");
        assertThat(result.getCategory()).isEqualTo("Poussettes, porte-bébés et sièges auto");
        assertThat(result.getConfidenceScore()).isEqualTo(85.0);
        assertThat(result.getCondition()).isEqualTo("Bon état");
        assertThat(result.isMultipleItemsDetected()).isFalse();
    }

    @Test
    void analyzeImages_shouldFallbackCategory_whenGeminiReturnsUnknownCategory() {
        String geminiResponse =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"title\\": \\"Produit\\", \\"description\\": \\"Desc\\", \\"category\\": \\"Unknown\\", \\"confidenceScore\\": 50}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponse, HttpStatus.OK));

        MultipartFile image =
                new MockMultipartFile("image", "test.jpg", "image/jpeg", "image".getBytes());

        ProductAnalysisResponse result = geminiVisionService.analyzeImages(List.of(image));

        assertThat(result.getCategory()).isEqualTo("Autres articles pour bébé et enfant");
    }

    @Test
    void analyzeImages_shouldResetConfidenceScore_whenOutOfRange() {
        String geminiResponse =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"title\\": \\"Produit\\", \\"description\\": \\"Desc\\", \\"category\\": \\"Jeux et jouets\\", \\"confidenceScore\\": 150}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponse, HttpStatus.OK));

        MultipartFile image =
                new MockMultipartFile("image", "test.jpg", "image/jpeg", "image".getBytes());

        ProductAnalysisResponse result = geminiVisionService.analyzeImages(List.of(image));

        assertThat(result.getConfidenceScore()).isEqualTo(0.0);
    }

    @Test
    void analyzeImages_shouldSetConditionToNull_whenGeminiReturnsUnknownCondition() {
        String geminiResponse =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"title\\": \\"Produit\\", \\"description\\": \\"Desc\\", \\"category\\": \\"Jeux et jouets\\", \\"confidenceScore\\": 70, \\"condition\\": \\"Parfait\\", \\"multipleItemsDetected\\": false}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponse, HttpStatus.OK));

        MultipartFile image =
                new MockMultipartFile("image", "test.jpg", "image/jpeg", "image".getBytes());

        ProductAnalysisResponse result = geminiVisionService.analyzeImages(List.of(image));

        assertThat(result.getCondition()).isNull();
    }

    @Test
    void analyzeImages_shouldReturnNullConditionAndMultipleItemsFlag_whenMultipleItemsDetected() {
        String geminiResponse =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"title\\": \\"Produit\\", \\"description\\": \\"Desc\\", \\"category\\": \\"Jeux et jouets\\", \\"confidenceScore\\": 0, \\"condition\\": null, \\"multipleItemsDetected\\": true}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponse, HttpStatus.OK));

        MultipartFile image =
                new MockMultipartFile("image", "test.jpg", "image/jpeg", "image".getBytes());

        ProductAnalysisResponse result = geminiVisionService.analyzeImages(List.of(image));

        assertThat(result.isMultipleItemsDetected()).isTrue();
        assertThat(result.getCondition()).isNull();
    }

    @Test
    void analyzeImages_shouldThrowServiceUnavailable_whenGeminiReturnsError() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));

        MultipartFile image =
                new MockMultipartFile("image", "test.jpg", "image/jpeg", "image".getBytes());

        assertThatThrownBy(() -> geminiVisionService.analyzeImages(List.of(image)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("unavailable");
    }
}
