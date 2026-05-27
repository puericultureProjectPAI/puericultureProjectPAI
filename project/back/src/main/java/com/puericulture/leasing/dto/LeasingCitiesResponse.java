package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Réponse contenant les villes disponibles en location")
public class LeasingCitiesResponse {

    @Schema(description = "Indique si la requête a réussi", example = "true")
    private boolean success;

    @Schema(description = "Nombre de villes", example = "5")
    private int count;

    @Schema(description = "Liste des villes")
    private List<String> data;
}
