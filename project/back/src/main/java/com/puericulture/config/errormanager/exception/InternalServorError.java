package com.puericulture.config.errormanager.exception;

public class InternalServorError extends RuntimeException {
    public InternalServorError(String message) {
        super(message);
    }

    public InternalServorError() {
        this("Une erreur est survenue...");
    }
}
