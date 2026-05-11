package com.puericulture.common.security;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults()) // Enables CORS with the configuration defined below
                .csrf(csrf -> csrf.disable()) // Often disabled for stateless APIs
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/api/public/**", "/troc/posts/**", "/troc/products/**").permitAll()
                                .anyRequest().authenticated());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // STRATEGIC CORRECTION:
        // In development, we allow localhost.
        // In production, we use the Vercel URL.
        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173", // Default Vite port
                        "http://localhost:4173", // Preview Vite port
                        "https://puericultureprojectpai-o8o2y0tr2-leo-defossezs-projects.vercel.app" // Production domain
                        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); // Necessary if you are using cookies or Basic auth

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
