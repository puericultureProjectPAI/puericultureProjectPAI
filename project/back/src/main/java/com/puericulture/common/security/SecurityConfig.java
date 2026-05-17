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

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
                // CSRF is disabled: the application relies strictly on stateless JWT authentication
                .csrf(csrf -> csrf.disable())

                // Enforce stateless session management — Spring must not maintain HTTP sessions
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth ->
                                auth
                                        // Public endpoints: health-check, public API, and Swagger
                                        // UI
                                        .requestMatchers(
                                                "/health",
                                                "/api/public/**",
                                                // Swagger / OpenAPI — must be accessible without a
                                                // token
                                                "/swagger-ui.html",
                                                "/swagger-ui/**",
                                                "/api-docs",
                                                "/api-docs/**",
                                                "/v3/api-docs",
                                                "/v3/api-docs/**",
                                                // Spring Boot Actuator health endpoint
                                                "/actuator/health")
                                        .permitAll()

                                        // Admin-only routes
                                        .requestMatchers("/api/admin/**")
                                        .hasRole("ADMIN")

                                        // All other requests require a valid Supabase JWT
                                        .anyRequest()
                                        .authenticated());

        // Validate the Supabase JWT before Spring's standard authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Explicit origins mapped to development and deployment environments
        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173", // Vite dev server
                        "http://localhost:4173", // Vite preview
                        "https://puericultureprojectpai.vercel.app"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
