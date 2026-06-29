package com.puericulture.config.errormanager;

import com.puericulture.config.errormanager.exception.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * Gestionnaire d'exceptions global pour l'application.
 *
 * <p>Cette classe utilise l'annotation {@link RestControllerAdvice} pour intercepter les exceptions
 * levées par n'importe quel component de l'application et les transformer en réponses HTTP au
 * format JSON.
 */
@RestControllerAdvice
@Slf4j
public class CustomGlobalExceptionHandler {

    /**
     * Gère les erreurs de type "Mauvaise Requête" (400).
     *
     * @param badRequestException L'exception contenant les détails de l'erreur client.
     * @return Une ResponseEntity contenant le message d'erreur et le statut 400.
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(
            BadRequestException badRequestException) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message(badRequestException.getMessage()).build());
    }

    /** Gère les erreurs de validation des DTOs (400). */
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String message = "Validation failed";
        if (ex.getBindingResult().getFieldError() != null) {
            message = ex.getBindingResult().getFieldError().getDefaultMessage();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message(message).build());
    }

    /**
     * Gère les erreurs de type "Mauvaise Requête" (400).
     *
     * @param messageNotReadableException L'exception contenant les détails de l'erreur client.
     * @return Une ResponseEntity contenant le message d'erreur et le statut 400.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException messageNotReadableException) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(
                        ErrorResponse.builder()
                                .message(messageNotReadableException.getMessage())
                                .build());
    }

    /**
     * Gère les accès interdits (403).
     *
     * @param forbiddenException Exception levée lors d'un manque de privilèges.
     * @return Une ResponseEntity avec le statut 403.
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbiddenException(
            ForbiddenException forbiddenException) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message(forbiddenException.getMessage()).build());
    }

    /**
     * Gère les erreurs internes du serveur spécifiques au métier (500).
     *
     * @param internalServerError L'exception métier pour une erreur serveur.
     * @return Une ResponseEntity avec le statut 500.
     */
    @ExceptionHandler(InternalServerError.class)
    public ResponseEntity<ErrorResponse> handleInternalServerError(
            InternalServerError internalServerError) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message(internalServerError.getMessage()).build());
    }

    /**
     * Gère l'absence de ressource métier (404).
     *
     * @param notFoundException Exception levée lorsqu'un objet est introuvable.
     * @return Une ResponseEntity avec le statut 404.
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            NotFoundException notFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message(notFoundException.getMessage()).build());
    }

    /**
     * Gère les défauts d'authentification (401). Force le type de contenu en JSON pour garantir la
     * structure de la réponse.
     *
     * @param unauthorizedException Exception d'absence d'authentification.
     * @return Une ResponseEntity avec le statut 401 et Content-Type JSON.
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(
            UnauthorizedException unauthorizedException) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message(unauthorizedException.getMessage()).build());
    }

    /**
     * Gère les erreurs de routage Spring (ex: URL inexistante) (404).
     *
     * @param noResourceFoundException Exception Spring standard.
     * @return Une ResponseEntity avec le statut 404.
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNoResourceFoundException(
            NoResourceFoundException noResourceFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_JSON)
                .body(
                        ErrorResponse.builder()
                                .message(noResourceFoundException.getMessage())
                                .build());
    }

    /** Gère les erreurs de validation des champs (@Valid, @NotBlank, @NotNull…) (400). */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {
        String message =
                ex.getBindingResult().getFieldErrors().stream()
                        .map(fe -> fe.getField() + " : " + fe.getDefaultMessage())
                        .findFirst()
                        .orElse("Données invalides");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message(message).build());
    }

    /** Gère les arguments illégaux (valeur de champ inconnue, entité introuvable…) (400). */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message(ex.getMessage()).build());
    }

    /**
     * Filet de sécurité final (500). Capture toutes les exceptions non traitées spécifiquement.
     *
     * @param e L'exception générique interceptée.
     * @return Une réponse par défaut pour ne pas divulguer d'informations sensibles.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("Unhandled exception", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ErrorResponse.builder().message("Une erreur est survenue...").build());
    }
}
