package com.puericulture.config.errormanager.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException() {
        this("Ressource non trouvée...");
    }
}
