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
                // CSRF is disabled as the application relies strictly on stateless JWT
                // authentication
                .csrf(csrf -> csrf.disable())

                // Enforce stateless session management. Spring must not maintain HTTP sessions.
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth ->
                                auth
                                        // The /api/auth/** wildcard is explicitly REMOVED.
                                        // Identity is handled by Supabase. Only health-checks and
                                        // specific public endpoints pass freely.
                                        .requestMatchers("/api/public/**", "/health", "/troc/posts/**", "/troc/products/**")
                                        .permitAll()
                                        .requestMatchers("/api/admin/**")
                                        .hasRole("ADMIN")

                                        // All other requests require a valid JWT validated by the
                                        // filter
                                        .anyRequest()
                                        .authenticated());

        // Intercept requests to validate the Supabase JWT before Spring attempts standard
        // authentication
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Strict explicit origins mapped to your development and deployment environments
        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173",
                        "http://localhost:4173",
                        "https://puericultureprojectpai.vercel.app"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
