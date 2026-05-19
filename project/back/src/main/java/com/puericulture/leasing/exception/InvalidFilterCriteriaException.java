package com.puericulture.leasing.exception;

import com.puericulture.config.errormanager.exception.BadRequestException;

/**
 * Lancée quand les critères de filtrage leasing sont invalides (aucun critère, dates incohérentes).
 * Hérite de BadRequestException pour retourner automatiquement un HTTP 400.
 */
public class InvalidFilterCriteriaException extends BadRequestException {

    public InvalidFilterCriteriaException(String message) {
        super(message);
    }
}
