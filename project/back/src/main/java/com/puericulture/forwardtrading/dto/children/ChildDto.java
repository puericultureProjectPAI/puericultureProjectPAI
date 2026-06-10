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
public class ChildDto {
    @Schema(example = "1", description = "ID unique de l'enfant")
    Long id;

    @Schema(example = "Cassian", nullable = false, description = "Child firstName")
    String firstName;

    Integer age;
    LocalDate birthDate;
    Long timelineId;
}
