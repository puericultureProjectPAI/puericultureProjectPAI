package com.puericulture.config.errormanager;

import com.puericulture.config.errormanager.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomGlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException badRequestException){
        return new ResponseEntity<>(ErrorResponse.builder()
                .message(badRequestException.getMessage())
                .build(),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbiddenException(ForbiddenException forbiddenException){
        return new ResponseEntity<>(ErrorResponse.builder()
                .message(forbiddenException.getMessage())
                .build(),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InternalServorError.class)
    public ResponseEntity<ErrorResponse> handleInternalServerError(InternalServorError internalServorError){
        return new ResponseEntity<>(ErrorResponse.builder()
                .message(internalServorError.getMessage())
                .build(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(NotFoundException notFoundException){
        return new ResponseEntity<>(ErrorResponse.builder()
                .message(notFoundException.getMessage())
                .build(),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException unauthorizedException){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .contentType(MediaType.APPLICATION_JSON).body(ErrorResponse.builder()
                .message(unauthorizedException.getMessage())
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e){
        return new ResponseEntity<>(ErrorResponse.builder()
                .message("Une erreur est survenue...")
                .build(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
