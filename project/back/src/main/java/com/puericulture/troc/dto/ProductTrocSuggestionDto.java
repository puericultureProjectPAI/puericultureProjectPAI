package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Troc product suggestion enriched with a relevance score.")
public class ProductTrocSuggestionDto extends ProductTrocDto {

    @Schema(description = "Relevance score from 0 to 100.", example = "85")
    private Integer indicePertinence;

    @Schema(description = "Short explanation of the relevance score.")
    private String pertinenceReason;

    @Schema(description = "Distance in kilometers when geolocation is available.", example = "3.5")
    private Double distanceKm;
}
