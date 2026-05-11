package com.puericulture.config.errormanager.exception;

public class NotImplementedException extends RuntimeException {
    public NotImplementedException(String message) {
        super(message);
    }

    public NotImplementedException() {
        this("Non implémenté.");
    }
}
