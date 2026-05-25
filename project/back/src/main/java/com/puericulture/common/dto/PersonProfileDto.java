package com.puericulture.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonProfileDto {
    @Schema(example = "Rigsby", nullable = false, description = "User firstName")
    String firstName;

    @Schema(example = "Wayne", nullable = false, description = "User lastName")
    String lastName;

    Integer memberSinceMonth;
    Integer memberSinceYear;
    Double trustScore;
    List<ChildPersonProfileDto> children;

    @Builder
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChildPersonProfileDto {
        @Schema(example = "Cassian", nullable = false, description = "Child firstName")
        String firstName;

        Integer age;
        LocalDate birthDate;
    }
}
