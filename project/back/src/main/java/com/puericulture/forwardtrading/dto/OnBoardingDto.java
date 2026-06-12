package com.puericulture.forwardtrading.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "On-boarding information describing the user's family situation")
public class OnBoardingDto {

    @JsonProperty("familyStatus")
    @NotNull @Schema(
            description =
                    "Family status. If 'parent', dueDate is null. If 'expecting', children is"
                            + " empty.",
            example = "both",
            allowableValues = {"expecting", "parent", "both"})
    private String familyStatus;

    @JsonProperty("dueDate")
    @Schema(description = "Child's birth date", example = "2022-05-12")
    private Date dueDate;

    @JsonProperty("children")
    @Valid
    @Schema(description = "List of children. Empty when familyStatus is 'expecting'.")
    private List<ChildDto> children;

    @JsonProperty("futurePlans")
    @NotNull @Schema(
            description = "Whether the user plans to have more children.",
            example = "yes",
            allowableValues = {"yes", "no", "undecided"})
    private String futurePlans;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Information about a child")
    public static class ChildDto {

        @JsonProperty("name")
        @NotNull @Schema(description = "Child's first name", example = "Léo")
        private String name;

        @JsonProperty("birthDate")
        @NotNull @Schema(description = "Child's birth date", example = "2022-05-12")
        private Date birthDate;

        @Schema(
                examples = {"m", "f", "s"},
                maxLength = 1,
                minLength = 1,
                allowableValues = {"m", "f", "s"})
        private String gender;
    }
}
