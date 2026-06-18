package com.puericulture;

import com.puericulture.secondhand.service.GeminiVisionService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
class DemoApplicationTests {

    @MockBean private GeminiVisionService geminiVisionService;

    // Déploiement d'une instance PostgreSQL isolée et éphémère
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    // Injection dynamique des identifiants générés par le conteneur dans le contexte Spring
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");

        // Neutralisation des dépendances externes
        registry.add("supabase.url", () -> "http://localhost:54321");
        registry.add("supabase.service.key", () -> "mock-key");
        registry.add("GEMINI_API_KEY", () -> "mock-key");
    }

    @Test
    void contextLoads() {
        // Le test s'exécute désormais contre un véritable moteur PostgreSQL jetable.
    }
}
