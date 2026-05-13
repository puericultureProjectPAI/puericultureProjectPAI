package com.puericulture.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@NoArgsConstructor
@Slf4j
public class JwtService {

    @Value("${supabase.jwt.secret}")
    private String jwtSecret;

    public String extractName(String token) {
        return extractClaim(
                token,
                claims -> {
                    HashMap<?, ?> userMetadata = claims.get("user_metadata", HashMap.class);
                    if (userMetadata != null && userMetadata.get("name") != null) {
                        return userMetadata.get("name").toString();
                    }
                    return null;
                });
    }

    public String extractRole(String token) {
        return extractClaim(
                token,
                claims -> {
                    HashMap<?, ?> userMetadata = claims.get("user_metadata", HashMap.class);
                    if (userMetadata != null && userMetadata.get("role") != null) {
                        return userMetadata.get("role").toString();
                    }
                    return null;
                });
    }

    public String extractPersonId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Validates the token cryptographically against the Supabase secret. Specific exceptions are
     * caught to avoid masking security threats or misconfigurations.
     */
    public Boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Malformed JWT token: {}", e.getMessage());
        } catch (Exception e) {
            log.error("JWT validation error: {}", e.getMessage());
        }
        return false;
    }

    private Key getSignKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
