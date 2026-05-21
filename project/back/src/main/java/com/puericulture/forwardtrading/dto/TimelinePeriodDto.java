package com.puericulture.forwardtrading.dto;

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
@Schema(description = "Request payload used to get a period containing article.")
public class TimelinePeriodDto {
    @Schema(description = "Timeline Period Identifier")
    private Long id;

    @Schema(
            description = "Timeline period type",
            examples = {"T1", "T5"})
    private String type;

    @Schema(
            description = "Timeline period label",
            examples = {"0-3 Months", "Old baby 18-25 year"})
    private String label;

    @Schema(description = "Timeline period product")
    private List<TimelineArticleDto> products;
}
