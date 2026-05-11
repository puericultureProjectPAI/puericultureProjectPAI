package com.puericulture.common.security;

import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// Assure-toi que l'import de ton filtre JWT correspond bien à ton arborescence
// import com.puericulture.common.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Importé du 2ème fichier
@RequiredArgsConstructor // Remplace @AllArgsConstructor, meilleure pratique avec Spring pour les
// champs "final"
public class SecurityConfig {

    // Importé du 2ème fichier
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults()) // Active la configuration CORS définie plus bas
                // (Réf 1)
                .csrf(csrf -> csrf.disable()) // Désactivé pour les API (Réf 1 & 2)

                // Gestion de session STATELESS requise pour le JWT (Importé du 2ème fichier)
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth ->
                                auth
                                        // Endpoints publics combinés (Réf 1 & 2)
                                        .requestMatchers(
                                                "/api/public/**", "/api/auth/**", "/health")
                                        .permitAll()

                                        // Endpoints admin (Importé du 2ème fichier)
                                        .requestMatchers("/api/admin/**")
                                        .hasRole("ADMIN")

                                        // Tout le reste nécessite une authentification
                                        .anyRequest()
                                        .authenticated());

        // Ajout du filtre JWT avant le filtre classique d'authentification (Importé du 2ème
        // fichier)
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // CORRECTION STRATÉGIQUE CONSERVÉE (Réf 1)
        // Beaucoup plus sécurisé que le "*" du 2ème fichier
        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173", // Default Vite port
                        "http://localhost:4173", // Preview Vite port
                        "https://puericultureprojectpai.vercel.app" // Production domain
                        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); // Nécessaire pour les cookies ou Basic auth

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
