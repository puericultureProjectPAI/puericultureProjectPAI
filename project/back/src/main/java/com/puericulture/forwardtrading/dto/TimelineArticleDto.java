package com.puericulture.forwardtrading.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload used to get a product.")
public class TimelineArticleDto {
    @Schema(description = "Timeline event identifier.")
    private Long id;

    @Schema(
            description = "Article name",
            examples = {"Sponge Bob bag", "Shrek bonnet", "GTA-5 Baby"},
            maxLength = 255,
            minLength = 0,
            nullable = false)
    private String name;

    @Schema(description = "Article price")
    private Double price;

    @Schema(
            description = "article tag",
            examples = {"Food", "Game"},
            maxLength = 255,
            minLength = 0)
    private String tag;
}
