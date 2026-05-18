package com.puericulture.leasing.dto;


import lombok.*;
import java.time.LocalDate;

/**
 * DTO de filtrage avec CRITÈRES OPTIONNELS
 * Tous les champs sont nullable
 *
 * Cas d'usage:
 * - Juste ville: { "city": "Paris" }
 * - Juste dates: { "startDate": "2025-06-01", "endDate": "2025-06-30" }
 * - Ville + dates: { "city": "Paris", "startDate": "2025-06-01", "endDate": "2025-06-30" }
 * - Aucun critère: {} (retourne tous)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeasingFilterRequest {

    /**
     * Optionnel: filtrer par ville
     */
    private String city;

    /**
     * Optionnel: date de début de la période
     */
    private LocalDate startDate;

    /**
     * Optionnel: date de fin de la période
     */
    private LocalDate endDate;

    /**
     * Valide que endDate >= startDate (si les deux sont fournies)
     */
    public boolean isValidDateRange() {
        // Si aucune date = valide
        if (startDate == null && endDate == null) {
            return true;
        }

        // Si une seule date = valide
        if (startDate == null || endDate == null) {
            return true;
        }

        // Si les deux = endDate doit être >= startDate
        return !endDate.isBefore(startDate);
    }

    /**
     * Vérifie qu'au moins UN critère est fourni
     */
    public boolean hasAnyCriteria() {
        boolean hasCity = city != null && !city.isBlank();
        boolean hasDates = startDate != null && endDate != null;
        return hasCity || hasDates;
    }
}


