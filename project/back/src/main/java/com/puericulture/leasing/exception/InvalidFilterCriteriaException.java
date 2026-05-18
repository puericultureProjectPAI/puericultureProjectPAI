package com.puericulture.leasing.exception;

public class InvalidFilterCriteriaException extends RuntimeException {

    /**
     * Constructeur avec message d'erreur
     *
     * @param message message descriptif de l'erreur
     */
    public InvalidFilterCriteriaException(String message) {
        super(message);
    }

    /**
     * Constructeur avec message et cause
     *
     * @param message message descriptif de l'erreur
     * @param cause exception originale
     */
    public InvalidFilterCriteriaException(String message, Throwable cause) {
        super(message, cause);
    }
}

