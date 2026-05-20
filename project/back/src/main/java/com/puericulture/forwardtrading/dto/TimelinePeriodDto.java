package com.puericulture.forwardtrading.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelinePeriodDto {
    private String id;
    private String type;
    private String label;
    private List<TimelineArticleDto> products;
}
