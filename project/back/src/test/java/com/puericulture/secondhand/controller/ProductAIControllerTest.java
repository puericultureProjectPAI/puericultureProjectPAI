package com.puericulture.secondhand.controller;

import static org.mockito.ArgumentMatchers.anyList;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.puericulture.secondhand.dto.ProductAnalysisResponse;
import com.puericulture.secondhand.service.GeminiVisionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductAIController.class)
class ProductAIControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private GeminiVisionService geminiService;

    @Test
    @DisplayName("Should return 200 OK when image analysis is successful")
    void analyzeProducts_Success() throws Exception {
        // Given
        MockMultipartFile file =
                new MockMultipartFile(
                        "images",
                        "poussette.jpg",
                        MediaType.IMAGE_JPEG_VALUE,
                        "image-content".getBytes());

        ProductAnalysisResponse mockResponse = new ProductAnalysisResponse();
        Mockito.when(geminiService.analyzeImages(anyList())).thenReturn(mockResponse);

        // When & Then
        mockMvc.perform(multipart("/second-hand/v1/ai/analyze-products").file(file))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should return 400 Bad Request when images list is empty")
    void analyzeProducts_EmptyList() throws Exception {
        // En envoyant une requête multipart sans fichier attaché au paramètre "images"
        mockMvc.perform(multipart("/second-hand/v1/ai/analyze-products"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 413 Payload Too Large when file count exceeds max limit")
    void analyzeProducts_TooManyFiles() throws Exception {
        // Given: Création de 6 fichiers (la limite est à 5)
        var requestBuilder = multipart("/second-hand/v1/ai/analyze-products");
        for (int i = 0; i < 6; i++) {
            requestBuilder.file(
                    new MockMultipartFile(
                            "images",
                            "image" + i + ".jpg",
                            MediaType.IMAGE_JPEG_VALUE,
                            "content".getBytes()));
        }

        // When & Then
        mockMvc.perform(requestBuilder).andExpect(status().isPayloadTooLarge());
    }

    @Test
    @DisplayName("Should return 413 Payload Too Large when a file exceeds max size")
    void analyzeProducts_FileTooLarge() throws Exception {
        // Given: Un fichier qui fait un peu plus de 5 Mo (5 * 1024 * 1024 + 10)
        int sizeInBytes = (5 * 1024 * 1024) + 10;
        byte[] largeContent = new byte[sizeInBytes];

        MockMultipartFile largeFile =
                new MockMultipartFile(
                        "images", "gros-berceau.png", MediaType.IMAGE_PNG_VALUE, largeContent);

        // When & Then
        mockMvc.perform(multipart("/second-hand/v1/ai/analyze-products").file(largeFile))
                .andExpect(status().isPayloadTooLarge());
    }

    @Test
    @DisplayName("Should return 415 Unsupported Media Type when file is not an image")
    void analyzeProducts_InvalidMimeType() throws Exception {
        // Given: Un fichier PDF au lieu d'une image
        MockMultipartFile pdfFile =
                new MockMultipartFile(
                        "images",
                        "facture.pdf",
                        MediaType.APPLICATION_PDF_VALUE,
                        "pdf-content".getBytes());

        // When & Then
        mockMvc.perform(multipart("/second-hand/v1/ai/analyze-products").file(pdfFile))
                .andExpect(status().isUnsupportedMediaType());
    }
}
