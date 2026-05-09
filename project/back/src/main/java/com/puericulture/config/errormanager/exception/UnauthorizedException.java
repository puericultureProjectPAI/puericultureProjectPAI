package com.puericulture.config.errormanager.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException() {
        this("Non autorisé.");
    }
}
