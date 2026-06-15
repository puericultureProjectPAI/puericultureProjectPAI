package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body to evaluate child safety for a leasing article using AI.")
public class LeasingSecurityCheckRequestDto {

    @NotBlank(message = "Le nom de l'article est obligatoire.")
    @Schema(
            description = "The name of the article to be checked.",
            example = "Poussette Babyzen Yoyo 2",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String articleName;

    @NotBlank(message = "L'âge de l'enfant est obligatoire.")
    @Schema(
            description = "The age of the child (e.g. '10 mois', '3 ans').",
            example = "10 mois",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String childAge;
}
