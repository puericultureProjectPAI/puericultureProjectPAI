package com.puericulture.common.security;

import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import io.jsonwebtoken.*;
import java.net.URL;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class JwtService {

    private final JwtParser jwtParser;

    public JwtService(@Value("${supabase.url}") String supabaseUrl) {
        try {
            // Normalisation de l'URL pour éviter les erreurs de double slash
            String baseUrl =
                    supabaseUrl.endsWith("/")
                            ? supabaseUrl.substring(0, supabaseUrl.length() - 1)
                            : supabaseUrl;
            String issuer = baseUrl + "/auth/v1";
            URL jwksUrl = new URL(issuer + "/.well-known/jwks.json");

            // JwkProvider robuste : Cache étendu, plafond de rate-limit augmenté contre le DoS, et
            // Timeouts drastiques
            JwkProvider jwkProvider =
                    new JwkProviderBuilder(jwksUrl)
                            .cached(10, 24, TimeUnit.HOURS)
                            .rateLimited(50, 1, TimeUnit.MINUTES) // Augmenté pour absorber le bruit
                            .timeouts(
                                    5000,
                                    5000) // 5 secondes max (Connect / Read) pour éviter le thread
                            // starvation
                            .build();

            SigningKeyResolver keyResolver =
                    new SigningKeyResolverAdapter() {
                        @Override
                        public Key resolveSigningKey(JwsHeader header, Claims claims) {
                            String kid = header.getKeyId();
                            if (kid == null) {
                                throw new IllegalArgumentException(
                                        "Key ID (kid) manquant dans le header JWT");
                            }
                            try {
                                return jwkProvider.get(kid).getPublicKey();
                            } catch (JwkException e) {
                                // Log en WARN sans la stacktrace complète pour anéantir le risque
                                // de log flooding
                                log.warn(
                                        "JWKS - Clé publique introuvable ou refusée pour le kid: {}",
                                        kid);
                                throw new SecurityException("Signature JWT non vérifiable");
                            }
                        }
                    };

            // Parseur exigeant l'Issuer et l'Audience pour valider l'intention, pas juste la
            // signature
            this.jwtParser =
                    Jwts.parserBuilder()
                            .setSigningKeyResolver(keyResolver)
                            .requireIssuer(issuer) // Bloque les tokens provenant d'un autre
                            // projet/environnement
                            .requireAudience(
                                    "authenticated") // Bloque les tokens qui n'ont pas la bonne
                            // portée d'authentification
                            .build();

            log.info("✅ JWT mode: JWKS Dynamique sécurisé activé (source: {})", jwksUrl);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Échec de l'initialisation JWKS avec l'URL: " + supabaseUrl, e);
        }
    }

    // -------------------------------------------------------------------------
    // Extraction des Claims
    // -------------------------------------------------------------------------

    public String extractName(String token) {
        return extractClaim(
                token,
                claims -> {
                    HashMap<?, ?> meta = claims.get("user_metadata", HashMap.class);
                    return (meta != null && meta.get("name") != null)
                            ? meta.get("name").toString()
                            : null;
                });
    }

    public String extractRole(String token) {
        return extractClaim(
                token,
                claims -> {
                    HashMap<?, ?> meta = claims.get("user_metadata", HashMap.class);
                    return (meta != null && meta.get("role") != null)
                            ? meta.get("role").toString()
                            : null;
                });
    }

    public String extractPersonId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return jwtParser.parseClaimsJws(token).getBody();
    }

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------

    public Boolean validateToken(String token) {
        try {
            jwtParser.parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            log.error("Signature JWT invalide");
        } catch (ExpiredJwtException e) {
            log.error("Token JWT expiré");
        } catch (MalformedJwtException e) {
            log.error("Token JWT malformé");
        } catch (Exception e) {
            log.error("Erreur de validation JWT : Requête rejetée");
        }
        return false;
    }
}
