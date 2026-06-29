package com.puericulture.leasing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.InternalServerError;
import com.puericulture.leasing.dto.LeasingSecurityCheckRequestDto;
import com.puericulture.leasing.dto.LeasingSecurityCheckResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

@ExtendWith(MockitoExtension.class)
class LeasingSecurityCheckServiceTest {

    @Mock private RestTemplate restTemplate;

    @InjectMocks private LeasingSecurityCheckService leasingSecurityCheckService;

    @BeforeEach
    void setUp() {
        leasingSecurityCheckService =
                new LeasingSecurityCheckService(restTemplate, new ObjectMapper());
        ReflectionTestUtils.setField(leasingSecurityCheckService, "apiKey", "test-api-key");
    }

    @Test
    void checkSafety_shouldReturnSuccessResponse_whenGeminiReturnsValidJson() {
        String geminiResponse =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"score\\": 85, \\"justifications\\": [\\"Phrase 1\\", \\"Phrase 2\\", \\"Phrase 3\\", \\"Phrase 4\\"]}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponse, HttpStatus.OK));

        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("Poussette Babyzen Yoyo 2")
                        .childAge("10 mois")
                        .build();

        LeasingSecurityCheckResponseDto result =
                leasingSecurityCheckService.checkSafety(requestDto);

        assertThat(result.getScore()).isEqualTo(85);
        assertThat(result.getLabel()).isEqualTo("Adapté à cet âge");
        assertThat(result.getJustifications())
                .hasSize(4)
                .containsExactly("Phrase 1", "Phrase 2", "Phrase 3", "Phrase 4");
    }

    @Test
    void checkSafety_shouldAssignCorrectLabel_basedOnScore() {
        // Test orange score range (41-70)
        String geminiResponseOrange =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"score\\": 55, \\"justifications\\": [\\"Phrase 1\\", \\"Phrase 2\\", \\"Phrase 3\\", \\"Phrase 4\\"]}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponseOrange, HttpStatus.OK));

        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("Poussette")
                        .childAge("10 mois")
                        .build();

        LeasingSecurityCheckResponseDto resultOrange =
                leasingSecurityCheckService.checkSafety(requestDto);
        assertThat(resultOrange.getScore()).isEqualTo(55);
        assertThat(resultOrange.getLabel()).isEqualTo("À utiliser avec précaution");

        // Test red score range (0-40)
        String geminiResponseRed =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"score\\": 20, \\"justifications\\": [\\"Phrase 1\\", \\"Phrase 2\\", \\"Phrase 3\\", \\"Phrase 4\\"]}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponseRed, HttpStatus.OK));

        LeasingSecurityCheckResponseDto resultRed =
                leasingSecurityCheckService.checkSafety(requestDto);
        assertThat(resultRed.getScore()).isEqualTo(20);
        assertThat(resultRed.getLabel()).isEqualTo("Déconseillé pour cet âge");
    }

    @Test
    void checkSafety_shouldThrowBadRequestException_whenArticleNameIsEmpty() {
        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("")
                        .childAge("10 mois")
                        .build();

        assertThatThrownBy(() -> leasingSecurityCheckService.checkSafety(requestDto))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("nom de l'article est obligatoire");
    }

    @Test
    void checkSafety_shouldThrowBadRequestException_whenChildAgeIsEmpty() {
        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("Poussette")
                        .childAge(" ")
                        .build();

        assertThatThrownBy(() -> leasingSecurityCheckService.checkSafety(requestDto))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("âge de l'enfant est obligatoire");
    }

    @Test
    void checkSafety_shouldThrowInternalServerError_whenGeminiReturnsHttpError() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));

        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("Poussette")
                        .childAge("10 mois")
                        .build();

        assertThatThrownBy(() -> leasingSecurityCheckService.checkSafety(requestDto))
                .isInstanceOf(InternalServerError.class)
                .hasMessageContaining("Analyse indisponible pour le moment");
    }

    @Test
    void checkSafety_shouldThrowInternalServerError_whenGeminiReturnsFewerJustifications() {
        String geminiResponseIncomplete =
                """
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"score\\": 85, \\"justifications\\": [\\"Phrase 1\\", \\"Phrase 2\\"]}"
                      }]
                    }
                  }]
                }
                """;

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(geminiResponseIncomplete, HttpStatus.OK));

        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("Poussette")
                        .childAge("10 mois")
                        .build();

        assertThatThrownBy(() -> leasingSecurityCheckService.checkSafety(requestDto))
                .isInstanceOf(InternalServerError.class)
                .hasMessageContaining("Analyse indisponible pour le moment");
    }
}
