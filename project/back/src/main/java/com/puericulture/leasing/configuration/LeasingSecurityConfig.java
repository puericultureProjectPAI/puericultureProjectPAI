package com.puericulture.leasing.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class LeasingSecurityConfig {

    /*
     * Chain dédiée aux routes leasing, évaluée avant la chain commune (@Order(1)).
     * CORS explicite requis : la chain principale ne propage pas sa config CORS ici.
     * Permet l'accès public en lecture sans modifier common/SecurityConfig.
     */
    @Bean
    @Order(1)
    public SecurityFilterChain leasingSecurityFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/leasing/products/**")
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
