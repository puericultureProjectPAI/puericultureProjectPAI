package com.puericulture.config.errormanager.exception;

/**
 * Exception métier représentant une image non reconnue comme article de puériculture. Retourne un
 * code 400 lorsque lancée.
 */
public class InvalidChildcareProductException extends BadRequestException {

    public InvalidChildcareProductException() {
        super("Image not recognized as childcare product");
    }
}
