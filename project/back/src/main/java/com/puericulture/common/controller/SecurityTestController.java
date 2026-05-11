package com.puericulture.common.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class SecurityTestController {

    @GetMapping("/auth")
    public ResponseEntity<?> testAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // auth.getName() renverra l'UUID défini dans le JwtAuthenticationFilter
        return ResponseEntity.ok(
                Map.of(
                        "status", "Accès Autorisé",
                        "extracted_uuid", auth.getName(),
                        "authorities", auth.getAuthorities()));
    }
}
