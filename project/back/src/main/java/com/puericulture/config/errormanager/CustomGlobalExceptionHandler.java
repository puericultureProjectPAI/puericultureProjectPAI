package com.puericulture.config.errormanager;

import com.puericulture.config.errormanager.exception.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

@RestControllerAdvice
public class CustomGlobalExceptionHandler implements AccessDeniedHandler {

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
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(InternalServorError internalServorError){
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
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(UnauthorizedException unauthorizedException){
        return new ResponseEntity<>(ErrorResponse.builder()
                .message(unauthorizedException.getMessage())
                .build(),
                HttpStatus.UNAUTHORIZED);
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        throw new UnauthorizedException("UNAUTHORIZED_ACCESS_DENIED");
    }
}
