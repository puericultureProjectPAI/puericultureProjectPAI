package com.puericulture.troc.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puericulture.troc.dto.ConditionAnalysisResponse;
import java.net.URL;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public class ProductConditionService {

    private static final List<String> ALLOWED_CONDITIONS =
            List.of("Neuf", "Très bon état", "Bon état", "État correct", "Usé");

    private static final String ANALYSIS_PROMPT =
            "Tu es un expert en évaluation d'articles de puériculture d'occasion. "
                    + "Analyse l'image fournie et évalue l'état visuel de l'article. "
                    + "IMPORTANT : Ta réponse doit être en français. "
                    + "Réponds UNIQUEMENT avec un objet JSON valide, sans markdown ni balises. "
                    + "Format attendu : {\"condition\": \"string\", \"confidenceScore\": number}. "
                    + "Valeurs autorisées pour condition : \"Neuf\", \"Très bon état\", \"Bon état\", \"État correct\", \"Usé\". "
                    + "confidenceScore doit être un entier entre 0 et 100. "
                    + "Si l'image est floue, ne montre pas clairement un article ou est de qualité insuffisante, "
                    + "retourne : {\"condition\": null, \"confidenceScore\": 0}.";

    @Value("${google.gemini.api-key}")
    private String apiKey;

    @Value("${google.gemini.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ProductConditionService(
            @Qualifier("trocRestTemplate") RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public ConditionAnalysisResponse analyzeCondition(String imageUrl) {
        try {
            byte[] imageBytes = new URL(imageUrl).openStream().readAllBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String mimeType = detectMimeType(imageUrl);

            Map<String, Object> payload = buildGeminiPayload(base64Image, mimeType);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            String url = apiUrl + "?key=" + apiKey;
            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, request, String.class);

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE, "Gemini API error");
            }

            return parseAndValidate(response.getBody());

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("AI condition analysis failed: {}", e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "AI service currently unavailable", e);
        }
    }

    private Map<String, Object> buildGeminiPayload(String base64Image, String mimeType) {
        return Map.of(
                "contents",
                List.of(
                        Map.of(
                                "parts",
                                List.of(
                                        Map.of("text", ANALYSIS_PROMPT),
                                        Map.of(
                                                "inline_data",
                                                Map.of(
                                                        "mime_type", mimeType,
                                                        "data", base64Image))))));
    }

    private ConditionAnalysisResponse parseAndValidate(String rawResponse) throws Exception {
        JsonNode root = objectMapper.readTree(rawResponse);
        String aiText =
                root.path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText()
                        .trim();

        String cleaned = aiText.replace("```json", "").replace("```", "").trim();
        ConditionAnalysisResponse result =
                objectMapper.readValue(cleaned, ConditionAnalysisResponse.class);

        if (result.getCondition() != null && !ALLOWED_CONDITIONS.contains(result.getCondition())) {
            log.warn("AI returned unknown condition '{}', setting to null", result.getCondition());
            result.setCondition(null);
            result.setConfidenceScore(0);
        }

        if (result.getConfidenceScore() == null
                || result.getConfidenceScore() < 0
                || result.getConfidenceScore() > 100) {
            result.setConfidenceScore(0);
        }

        return result;
    }

    private String detectMimeType(String imageUrl) {
        String lower = imageUrl.toLowerCase();
        if (lower.contains(".png")) return "image/png";
        if (lower.contains(".webp")) return "image/webp";
        return "image/jpeg";
    }
}
