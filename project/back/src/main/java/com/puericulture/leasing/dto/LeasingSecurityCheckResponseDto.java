package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response payload representing the AI safety evaluation results.")
public class LeasingSecurityCheckResponseDto {

    @Schema(
            description = "Safety evaluation score out of 100.",
            example = "85",
            minimum = "0",
            maximum = "100")
    private Integer score;

    @Schema(
            description =
                    "Safety label based on the score ('Déconseillé pour cet âge', 'À utiliser avec précaution', 'Adapté à cet âge').",
            example = "Adapté à cet âge")
    private String label;

    @Schema(
            description = "Exactly 4 short sentences justifying the safety score in French.",
            example =
                    "[\"Cet article respecte les normes de sécurité en vigueur pour cet âge.\", \"La taille et le harnais de sécurité conviennent parfaitement à sa morphologie.\", \"Le pliage compact évite les pincements accidentels.\", \"Attention à toujours attacher les sangles lors des déplacements.\"]")
    private List<String> justifications;
}
