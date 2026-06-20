package com.puericulture.leasing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.InternalServerError;
import com.puericulture.leasing.dto.LeasingSecurityCheckRequestDto;
import com.puericulture.leasing.dto.LeasingSecurityCheckResponseDto;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class LeasingSecurityCheckService {

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    private final String apiUrl =
            "https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LeasingSecurityCheckResponseDto checkSafety(LeasingSecurityCheckRequestDto request) {
        if (request.getArticleName() == null || request.getArticleName().trim().isEmpty()) {
            throw new BadRequestException("Le nom de l'article est obligatoire.");
        }
        if (request.getChildAge() == null || request.getChildAge().trim().isEmpty()) {
            throw new BadRequestException("L'âge de l'enfant est obligatoire.");
        }

        try {
            String prompt = buildPrompt(request.getArticleName(), request.getChildAge());
            Map<String, Object> payload =
                    Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));

            String url = apiUrl + "?key=" + apiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                log.error("Gemini API error status: {}", response.getStatusCode());
                throw new InternalServerError("Analyse indisponible pour le moment");
            }

            return parseAndValidateResponse(response.getBody());

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error calling Gemini API for safety check", e);
            throw new InternalServerError("Analyse indisponible pour le moment");
        }
    }

    private String buildPrompt(String articleName, String childAge) {
        return "Tu es un expert en sécurité de la puériculture. "
                + "Analyse les risques de sécurité potentiels de l'article de puériculture suivant : '"
                + articleName
                + "' "
                + "pour un enfant de cet âge : '"
                + childAge
                + "'. "
                + "Fournis une évaluation stricte, objective et constructive.\n\n"
                + "Instructions de formatage :\n"
                + "- Retourne UNIQUEMENT un objet JSON valide. Ne l'entoure PAS de balises ```json ou ```.\n"
                + "- Le JSON doit avoir exactement cette structure:\n"
                + "  {\n"
                + "    \"score\": <nombre entier entre 0 et 100 indiquant le niveau de sécurité et d'adaptabilité de l'article>,\n"
                + "    \"justifications\": [<liste contenant exactement 4 phrases courtes, claires et rédigées en français destinées directement au parent pour justifier le score>]\n"
                + "  }\n"
                + "- Chaque phrase doit apporter une explication concise et distincte (par exemple sur l'adéquation de la taille, du poids, de la motricité requise ou des normes de sécurité de l'article).\n"
                + "- Pas de texte en dehors du JSON.";
    }

    private LeasingSecurityCheckResponseDto parseAndValidateResponse(String rawResponse)
            throws Exception {
        JsonNode root = objectMapper.readTree(rawResponse);
        String text =
                root.path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText()
                        .trim();

        text = text.replace("```json", "").replace("```", "").trim();

        JsonNode jsonResponse = objectMapper.readTree(text);
        if (!jsonResponse.has("score") || !jsonResponse.has("justifications")) {
            throw new InternalServerError("Analyse indisponible pour le moment");
        }

        int score = jsonResponse.get("score").asInt();
        if (score < 0) score = 0;
        if (score > 100) score = 100;

        List<String> justifications = new ArrayList<>();
        JsonNode justificationsNode = jsonResponse.get("justifications");
        if (justificationsNode.isArray()) {
            for (JsonNode node : justificationsNode) {
                justifications.add(node.asText());
            }
        }

        if (justifications.size() != 4) {
            log.error(
                    "Gemini safety check did not return exactly 4 justifications: {}",
                    justifications.size());
            throw new InternalServerError("Analyse indisponible pour le moment");
        }

        String label;
        if (score <= 40) {
            label = "Déconseillé pour cet âge";
        } else if (score <= 70) {
            label = "À utiliser avec précaution";
        } else {
            label = "Adapté à cet âge";
        }

        return LeasingSecurityCheckResponseDto.builder()
                .score(score)
                .label(label)
                .justifications(justifications)
                .build();
    }
}
