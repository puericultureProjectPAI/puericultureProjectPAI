package com.puericulture.troc.dto;

import com.puericulture.common.dto.PersonDto;
import com.puericulture.troc.entity.TrocSuggestionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Represents a recommended troc suggestion for the connected user.")
public class TrocSuggestionResponse {

    @Schema(description = "Unique suggestion identifier.", example = "12")
    private Long id;

    @Schema(description = "Product owned by the connected user and proposed for exchange.")
    private ProductTrocDto requesterProduct;

    @Schema(description = "Product suggested as a compatible exchange target.")
    private ProductTrocDto suggestedProduct;

    @Schema(description = "Profile of the owner of the suggested product.")
    private PersonDto otherUser;

    @Schema(description = "Compatibility score from 0 to 100.", example = "85")
    private Integer compatibilityScore;

    @Schema(description = "Short explanation of the compatibility score.")
    private String compatibilityReason;

    @Schema(description = "Estimated distance in kilometers when location data is available.")
    private Double distanceKm;

    @Schema(description = "Current status of the suggestion.", example = "ACTIVE")
    private TrocSuggestionStatus status;

    @Schema(description = "Suggestion creation date.")
    private OffsetDateTime createdAt;
}
