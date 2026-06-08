package com.puericulture.secondhand.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puericulture.secondhand.dto.ProductAnalysisResponse;
import java.io.IOException;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiVisionService {

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    private final String apiUrl =
            "https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final List<String> ALLOWED_CATEGORIES =
            List.of(
                    "Vêtements (filles & garçons)",
                    "Jeux et jouets",
                    "Poussettes, porte-bébés et sièges auto",
                    "Meubles et décoration",
                    "Bain et change",
                    "Sécurité bébé et enfant",
                    "Allaitement et alimentation",
                    "Sommeil et literie",
                    "Santé et grossesse",
                    "Autres articles pour bébé et enfant");

    public ProductAnalysisResponse analyzeImages(List<MultipartFile> images) {
        try {
            Map<String, Object> requestBody = buildGeminiPayload(images);

            String url = apiUrl + "?key=" + apiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE, "Gemini API Error");
            }

            ProductAnalysisResponse result = parseAndValidateResponse(response.getBody());

            // If the AI is not confident that the image represents a puériculture item,
            // return a business error so the frontend can inform the user and allow manual input.
            if (result.getConfidenceScore() == null || result.getConfidenceScore() < 30.0) {
                throw new com.puericulture.config.errormanager.exception
                        .InvalidChildcareProductException();
            }

            return result;

        } catch (Exception e) {
            log.error("Error during AI analysis: {}", e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "AI Service currently unavailable", e);
        }
    }

    private Map<String, Object> buildGeminiPayload(List<MultipartFile> images) throws IOException {
        log.info("===> Début de la construction du payload Gemini pour {} image(s)", images.size());
        List<Map<String, Object>> parts = new ArrayList<>();

        String prompt =
                "Analyze the provided image(s). "
                        + "IMPORTANT: The title and description must be in FRENCH. "
                        + "The category must be exactly one of the allowed categories, written exactly as provided. "
                        + "Return ONLY a valid JSON object. "
                        + "Categories allowed: "
                        + ALLOWED_CATEGORIES
                        + ". "
                        + "Confidence score must be between 0 and 100. "
                        + "Format: {\"title\": \"string\", \"description\": \"string\", \"category\": \"string\", \"confidenceScore\": number}. "
                        + "Do not include markdown markers like ```json.";

        log.debug("Prompt envoyé : {}", prompt);
        parts.add(Map.of("text", prompt));

        for (int i = 0; i < images.size(); i++) {
            MultipartFile img = images.get(i);

            String contentType = img.getContentType();
            if (contentType != null && contentType.contains(";")) {
                contentType = contentType.split(";")[0];
            }

            log.info(
                    "Traitement image {} : Nom={}, Type={}, Taille={} octets",
                    i + 1,
                    img.getOriginalFilename(),
                    contentType,
                    img.getSize());

            byte[] bytes = img.getBytes();
            String base64Data = Base64.getEncoder().encodeToString(bytes);

            log.debug(
                    "Image {} Base64 (début) : {}...",
                    i + 1,
                    base64Data.substring(0, Math.min(base64Data.length(), 50)));

            parts.add(
                    Map.of(
                            "inline_data",
                            Map.of(
                                    "mime_type",
                                    contentType != null ? contentType : "image/jpeg",
                                    "data",
                                    base64Data)));
        }

        Map<String, Object> finalPayload = Map.of("contents", List.of(Map.of("parts", parts)));

        log.info("===> Payload construit avec succès. Nombre total de 'parts' : {}", parts.size());

        return finalPayload;
    }

    private ProductAnalysisResponse parseAndValidateResponse(String rawResponse) throws Exception {
        JsonNode root = objectMapper.readTree(rawResponse);
        String aiJsonText =
                root.path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText()
                        .trim();

        aiJsonText = aiJsonText.replace("```json", "").replace("```", "").trim();

        ProductAnalysisResponse result =
                objectMapper.readValue(aiJsonText, ProductAnalysisResponse.class);

        if (!ALLOWED_CATEGORIES.contains(result.getCategory())) {
            result.setCategory("Autres articles pour bébé et enfant");
        }
        if (result.getConfidenceScore() < 0 || result.getConfidenceScore() > 100) {
            result.setConfidenceScore(0.0);
        }

        return result;
    }
}
