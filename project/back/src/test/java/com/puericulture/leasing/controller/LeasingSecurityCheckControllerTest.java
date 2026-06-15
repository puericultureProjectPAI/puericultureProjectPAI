package com.puericulture.leasing.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.puericulture.config.errormanager.CustomGlobalExceptionHandler;
import com.puericulture.config.errormanager.exception.InternalServerError;
import com.puericulture.leasing.dto.LeasingSecurityCheckRequestDto;
import com.puericulture.leasing.dto.LeasingSecurityCheckResponseDto;
import com.puericulture.leasing.service.LeasingSecurityCheckService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class LeasingSecurityCheckControllerTest {

    @Mock private LeasingSecurityCheckService leasingSecurityCheckService;

    @InjectMocks private LeasingSecurityCheckController leasingSecurityCheckController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc =
                MockMvcBuilders.standaloneSetup(leasingSecurityCheckController)
                        .setControllerAdvice(new CustomGlobalExceptionHandler())
                        .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void checkSecurity_shouldReturn200_whenRequestIsValid() throws Exception {
        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("Poussette Babyzen Yoyo 2")
                        .childAge("10 mois")
                        .build();

        LeasingSecurityCheckResponseDto responseDto =
                LeasingSecurityCheckResponseDto.builder()
                        .score(85)
                        .label("Adapté à cet âge")
                        .justifications(List.of("Phrase 1", "Phrase 2", "Phrase 3", "Phrase 4"))
                        .build();

        when(leasingSecurityCheckService.checkSafety(any(LeasingSecurityCheckRequestDto.class)))
                .thenReturn(responseDto);

        mockMvc.perform(
                        post("/leasing/security-check")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(85))
                .andExpect(jsonPath("$.label").value("Adapté à cet âge"))
                .andExpect(jsonPath("$.justifications[0]").value("Phrase 1"))
                .andExpect(jsonPath("$.justifications").isArray());
    }

    @Test
    void checkSecurity_shouldReturn400_whenArticleNameIsEmpty() throws Exception {
        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("")
                        .childAge("10 mois")
                        .build();

        mockMvc.perform(
                        post("/leasing/security-check")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void checkSecurity_shouldReturn400_whenChildAgeIsEmpty() throws Exception {
        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("Poussette")
                        .childAge("")
                        .build();

        mockMvc.perform(
                        post("/leasing/security-check")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void checkSecurity_shouldReturn500_whenServiceThrowsInternalServerError() throws Exception {
        LeasingSecurityCheckRequestDto requestDto =
                LeasingSecurityCheckRequestDto.builder()
                        .articleName("Poussette")
                        .childAge("10 mois")
                        .build();

        when(leasingSecurityCheckService.checkSafety(any(LeasingSecurityCheckRequestDto.class)))
                .thenThrow(new InternalServerError("Analyse indisponible pour le moment"));

        mockMvc.perform(
                        post("/leasing/security-check")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Analyse indisponible pour le moment"));
    }
}
