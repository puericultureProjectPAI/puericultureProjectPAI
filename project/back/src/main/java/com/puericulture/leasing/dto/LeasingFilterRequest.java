package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Critères de filtrage des produits en location (au moins un obligatoire)")
public class LeasingFilterRequest {

    @Schema(description = "Ville de destination", example = "Paris")
    private String city;

    @Schema(description = "Date de début de la période de location", example = "2026-06-01")
    private LocalDate startDate;

    @Schema(description = "Date de fin de la période de location", example = "2026-06-30")
    private LocalDate endDate;
}
