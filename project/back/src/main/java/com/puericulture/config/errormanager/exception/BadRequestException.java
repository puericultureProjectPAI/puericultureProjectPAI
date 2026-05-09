package com.puericulture.config.errormanager.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException() {
        this("Mauvaise requête...");
    }
}
