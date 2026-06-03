package com.puericulture.secondhand.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.puericulture.secondhand.dto.ProductAnalysisResponse;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

@RestClientTest(GeminiVisionService.class)
class GeminiVisionServiceTest {

    @TestConfiguration
    static class LocalTestConfig {
        @Bean
        public RestTemplate restTemplate(RestTemplateBuilder builder) {
            // This builds the RestTemplate using the builder provided by @RestClientTest.
            // It allows MockRestServiceServer to automatically intercept external HTTP requests.
            return builder.build();
        }
    }

    @Autowired private GeminiVisionService geminiService;

    @Autowired private MockRestServiceServer mockServer;

    @Autowired private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockServer.reset();
    }

    @Test
    @DisplayName("Should parse Gemini API response correctly into ProductAnalysisResponse")
    void analyzeImages_Success() throws Exception {
        // Given
        MockMultipartFile mockFile =
                new MockMultipartFile(
                        "images",
                        "poussette.jpg",
                        MediaType.IMAGE_JPEG_VALUE,
                        "image-data".getBytes());

        String geminiApiResponse =
                """
            {
              "candidates": [{
                "content": {
                  "parts": [{
                    "text": "{\\"title\\": \\"Poussette Trio Confort\\", \\"description\\": \\"Une poussette incroyable\\", \\"category\\": \\"Sortie & Voyage\\", \\"confidenceScore\\": 95}"
                  }]
                }
              }]
            }
            """;

        this.mockServer
                .expect(
                        requestTo(
                                org.hamcrest.Matchers.startsWith(
                                        "https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent")))
                .andExpect(method(POST))
                .andRespond(withSuccess(geminiApiResponse, MediaType.APPLICATION_JSON));

        // When
        ProductAnalysisResponse result = geminiService.analyzeImages(List.of(mockFile));

        // Then
        assertNotNull(result);
        assertEquals("Poussette Trio Confort", result.getTitle());
        assertEquals("Sortie & Voyage", result.getCategory());
        assertEquals(95.0, result.getConfidenceScore());
    }

    @Test
    @DisplayName("Should fallback to 'Other' when Gemini returns an unknown category")
    void analyzeImages_UnknownCategoryFallback() throws Exception {
        // Given
        MockMultipartFile mockFile =
                new MockMultipartFile("images", "test.jpg", "image/jpeg", "data".getBytes());
        String jsonWithUnknownCategory =
                """
            {
              "candidates": [{
                "content": { "parts": [{ "text": "{\\"title\\": \\"Test\\", \\"description\\": \\"desc\\", \\"category\\": \\"UnknownCategory\\", \\"confidenceScore\\": 50}" }] }
              }]
            }
            """;

        this.mockServer
                .expect(requestTo(org.hamcrest.Matchers.containsString("generateContent")))
                .andRespond(withSuccess(jsonWithUnknownCategory, MediaType.APPLICATION_JSON));

        // When
        ProductAnalysisResponse result = geminiService.analyzeImages(List.of(mockFile));

        // Then
        assertEquals("Other", result.getCategory());
    }

    @Test
    @DisplayName("Should clean markdown backticks from Gemini response text")
    void analyzeImages_CleansMarkdown() throws Exception {
        // Given
        String markdownResponse =
                """
            {
              "candidates": [{
                "content": {
                  "parts": [{
                    "text": "```json\\n{\\"title\\": \\"Lit Bébé\\", \\"description\\": \\"Dodo\\", \\"category\\": \\"Sommeil\\", \\"confidenceScore\\": 80}\\n```"
                  }]
                }
              }]
            }
            """;

        this.mockServer
                .expect(requestTo(org.hamcrest.Matchers.containsString("generateContent")))
                .andRespond(withSuccess(markdownResponse, MediaType.APPLICATION_JSON));

        // When
        ProductAnalysisResponse result =
                geminiService.analyzeImages(
                        List.of(
                                new MockMultipartFile(
                                        "images", "i.jpg", "image/jpeg", "d".getBytes())));

        // Then
        assertEquals("Lit Bébé", result.getTitle());
        assertEquals("Sommeil", result.getCategory());
    }
}
