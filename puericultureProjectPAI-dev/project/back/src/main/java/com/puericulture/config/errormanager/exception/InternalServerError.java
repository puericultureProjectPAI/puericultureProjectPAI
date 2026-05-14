package com.puericulture.config.errormanager.exception;

public class InternalServerError extends RuntimeException {
    public InternalServerError(String message) {
        super(message);
    }

    public InternalServerError() {
        this("Une erreur est survenue...");
    }
}
