package com.puericulture.config.errormanager.exception;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException() {
        this("Requête non autorisée.");
    }
}
