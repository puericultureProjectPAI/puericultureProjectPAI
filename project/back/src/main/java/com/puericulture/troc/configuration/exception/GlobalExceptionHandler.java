package com.puericulture.troc.configuration.exception;

import com.puericulture.troc.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleProductNotFound(ProductNotFoundException ex) {

        return new ErrorResponse(ex.getMessage());
    }

    @ExceptionHandler(ExchangeAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleExchangeAlreadyExists(ExchangeAlreadyExistsException ex) {

        return new ErrorResponse(ex.getMessage());
    }

    @ExceptionHandler(InvalidExchangeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInvalidExchange(InvalidExchangeException ex) {

        return new ErrorResponse(ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedExchangeActionException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleUnauthorizedAction(UnauthorizedExchangeActionException ex) {

        return new ErrorResponse(ex.getMessage());
    }
}
