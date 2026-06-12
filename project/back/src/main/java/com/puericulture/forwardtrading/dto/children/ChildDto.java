package com.puericulture.forwardtrading.dto.children;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Représente un enfant associé au compte d'un utilisateur.")
public class ChildDto {
    @Schema(example = "1", description = "ID unique de l'enfant")
    Long id;

    @Schema(example = "Cassian", nullable = false, description = "Child firstName")
    String firstName;

    @Schema(
            example = "2",
            description = "Âge de l'enfant en années, calculé à partir de la date de naissance.")
    Integer age;

    @Schema(example = "2024-03-15", description = "Date de naissance de l'enfant (ISO 8601).")
    LocalDate birthDate;

    @Schema(example = "10", description = "Identifiant de la timeline associée à cet enfant.")
    Long timelineId;
}
