package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Critères de filtrage des produits en location (au moins un obligatoire)")
public class LeasingFilterRequest {

    @Schema(description = "Ville de destination", example = "Paris")
    private String city;

    @Schema(description = "Date de début de la période de location", example = "2025-06-01")
    private LocalDate startDate;

    @Schema(description = "Date de fin de la période de location", example = "2025-06-30")
    private LocalDate endDate;

    public boolean isValidDateRange() {
        if (startDate == null && endDate == null) return true;
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }

    public boolean hasAnyCriteria() {
        boolean hasCity = city != null && !city.isBlank();
        boolean hasDates = startDate != null && endDate != null;
        return hasCity || hasDates;
    }
}
