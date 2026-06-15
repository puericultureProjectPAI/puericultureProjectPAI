package com.puericulture.forwardtrading.dto.children;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateChildren {
    @Schema(example = "Lord Voldemort", maxLength = 255, minLength = 0)
    String name;

    @Schema(example = "2026-11-27")
    private LocalDate dpa;

    @Schema(
            examples = {"m", "f", "s"},
            maxLength = 1,
            minLength = 1,
            allowableValues = {"m", "f", "s"})
    String gender;
}
